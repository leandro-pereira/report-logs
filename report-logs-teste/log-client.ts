import axios, { AxiosInstance } from 'axios';
import { v4 as uuidv4 } from 'uuid';

export interface LogPayload {
  message: string;
  level?: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  context?: string;
  metadata?: Record<string, any>;
  stack?: string;
  ambient?: string;
  requestId?: string;
  path?: string;
  method?: string;
  userAgent?: string;
  statusCode?: number;
  authenticatedBy?: string;
  responseTime?: number;
  errorMessage?: string;
}

export class LogClient {
  private axiosInstance: AxiosInstance;
  private requestId: string = uuidv4();
  private isRefreshingKey: boolean = false;
  private apiKey: string | null = null;
  private apiSecret: string | null = null;
  private isInitialized: boolean = false;
  private initializationPromise: Promise<void>;

  constructor(
    private logsApiUrl: string,
    private projectName: string,
    private ambient: 'development' | 'staging' | 'production' = 'development',
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.logsApiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
    // Inicializar credenciais de forma assíncrona sem bloquear o constructor
    this.initializationPromise = this.initializeCredentials().catch((err) =>
      console.error('Erro ao inicializar credenciais:', err),
    );
  }

  /**
   * Aguarda a inicialização das credenciais
   */
  private async waitForInitialization() {
    if (!this.isInitialized) {
      await this.initializationPromise;
    }
  }

  /**
   * Inicializa as credenciais fazendo uma request para obter a API Key
   */
  private async initializeCredentials() {
    try {
      console.log('🔑 Obtendo credenciais da API de logs...');
      console.log(`📍 URL da API: ${this.logsApiUrl}`);
      console.log(`📝 Nome do projeto: ${this.projectName}`);
      
      const response = await axios.post(`${this.logsApiUrl}/api-keys`, {
        name: this.projectName,
      });

      this.apiKey = response.data.data.key;
      this.apiSecret = response.data.data.secret;
      this.createAxiosInstance();
      this.isInitialized = true;

      console.log(`✅ Credenciais obtidas com sucesso!`);
      console.log(`🔐 API Key: ${this.apiKey?.substring(0, 20)}...`);
    } catch (error) {
      const err = error as any;
      console.error(
        '❌ Erro ao obter credenciais:',
        err.response?.data || err.message,
      );
      console.error('📍 Detalhes do erro:', {
        status: err.response?.status,
        url: err.config?.url,
        method: err.config?.method,
      });
      // Define valores padrão se falhar
      this.apiKey = 'key_pending';
      this.apiSecret = 'secret_pending';
      this.createAxiosInstance();
      this.isInitialized = true;
    }
  }

  /**
   * Cria uma nova instância do axios com os headers atualizados
   */
  private createAxiosInstance() {
    this.axiosInstance = axios.create({
      baseURL: this.logsApiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}:${this.apiSecret}`,
      },
      timeout: 5000,
    });
  }

  /**
   * Gera um novo ID de requisição
   */
  generateRequestId(): string {
    this.requestId = uuidv4();
    return this.requestId;
  }

  /**
   * Retorna o ID da requisição atual
   */
  getRequestId(): string {
    return this.requestId;
  }

  /**
   * Obtém uma nova API Key do servidor
   */
  private async refreshApiKey(): Promise<{ key: string; secret: string }> {
    if (this.isRefreshingKey) {
      // Evita múltiplas requisições simultâneas
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.isRefreshingKey) {
            clearInterval(checkInterval);
            resolve({ key: this.apiKey, secret: this.apiSecret });
          }
        }, 100);
      });
    }

    this.isRefreshingKey = true;

    try {
      const response = await axios.post(`${this.logsApiUrl}/api-keys`, {
        name: this.projectName,
      });

      const { key, secret } = response.data.data;

      // Atualizar credenciais em memória
      this.apiKey = key;
      this.apiSecret = secret;
      this.createAxiosInstance();

      console.log(
        `✅ API Key renovada com sucesso para o projeto "${this.projectName}"`,
      );

      return { key, secret };
    } catch (error) {
      const err = error as any;
      console.error(
        '❌ Erro ao renovar API Key:',
        err.response?.data?.message || err.message,
      );
      throw error;
    } finally {
      this.isRefreshingKey = false;
    }
  }

  /**
   * Envia um log para a aplicação Report Logs com retry automático
   */
  async sendLog(payload: LogPayload, retryCount: number = 0): Promise<string> {
    const MAX_RETRIES = 2;

    // Aguardar inicialização antes de enviar
    await this.waitForInitialization();

    try {
      console.log(`📤 Enviando log (tentativa ${retryCount + 1}/${MAX_RETRIES + 1})...`);
      console.log(`🔐 Credenciais: key=${this.apiKey?.substring(0, 10)}..., secret=${this.apiSecret?.substring(0, 10)}...`);
      
      const response = await this.axiosInstance.post('/logs', {
        requestId: payload.requestId || this.requestId,
        message: payload.message,
        level: payload.level || 'INFO',
        context: payload.context,
        metadata: payload.metadata,
        stack: payload.stack,
        ambient: payload.ambient || this.ambient,
        path: payload.path,
        method: payload.method,
        userAgent: payload.userAgent,
        statusCode: payload.statusCode,
        authenticatedBy: payload.authenticatedBy,
        responseTime: payload.responseTime,
        errorMessage: payload.errorMessage,
      });

      console.log(`✅ Log enviado com sucesso! ID: ${response.data.logId}`);
      return response.data.logId;
    } catch (error) {
      const err = error as any;
      console.error(`❌ Erro ao enviar log:`, {
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
        url: err.config?.url,
      });

      // Se for erro de autenticação (401) e ainda tem retries
      if (
        (err.response?.status === 401 || err.response?.status === 403) &&
        retryCount < MAX_RETRIES
      ) {
        console.warn(
          `⚠️  API Key expirada ou inválida. Tentando renovar (tentativa ${retryCount + 1}/${MAX_RETRIES})...`,
        );

        try {
          await this.refreshApiKey();
          // Tentar novamente com a nova chave
          return this.sendLog(payload, retryCount + 1);
        } catch (refreshError) {
          console.error('❌ Falha ao renovar API Key:', refreshError);
          return null;
        }
      }

      // Para outros erros, apenas registrar e retornar null
      console.error('Erro ao enviar log:', err.message);
      return null;
    }
  }

  /**
   * Envia um log de INFO
   */
  async info(message: string, context?: string, metadata?: any, logPayload?: Partial<LogPayload>): Promise<string> {
    return this.sendLog({
      message,
      level: 'INFO',
      context,
      metadata,
      ...logPayload,
    });
  }

  /**
   * Envia um log de WARN
   */
  async warn(message: string, context?: string, metadata?: any, logPayload?: Partial<LogPayload>): Promise<string> {
    return this.sendLog({
      message,
      level: 'WARN',
      context,
      metadata,
      ...logPayload,
    });
  }

  /**
   * Envia um log de ERROR
   */
  async error(
    message: string,
    error?: Error | any,
    context?: string,
    metadata?: any,
    stack?: string,
    logPayload?: Partial<LogPayload>,
  ): Promise<string> {
    return this.sendLog({
      message,
      level: 'ERROR',
      context,
      metadata,
      stack: stack || error?.stack || JSON.stringify(error),
      ...logPayload,
    });
  }

  /**
   * Envia um log de DEBUG
   */
  async debug(message: string, context?: string, metadata?: any, logPayload?: Partial<LogPayload>): Promise<string> {
    return this.sendLog({
      message,
      level: 'DEBUG',
      context,
      metadata,
      ...logPayload,
    });
  }
}
