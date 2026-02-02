import axios, { AxiosInstance } from 'axios';

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
  private client: AxiosInstance;
  private apiKey?: string;
  private apiSecret?: string;

  constructor(apiUrl: string = 'http://localhost:3000', apiKey?: string, apiSecret?: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;

    this.client = axios.create({
      baseURL: apiUrl,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && apiSecret && {
          'Authorization': `Bearer ${apiKey}:${apiSecret}`,
        }),
      },
    });
  }

  /**
   * Define as credenciais da API
   */
  setCredentials(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.client.defaults.headers['Authorization'] = `Bearer ${apiKey}:${apiSecret}`;
  }

  async log(payload: LogPayload): Promise<string> {
    try {
      const response = await this.client.post('/logs', {
        message: payload.message,
        level: payload.level || 'INFO',
        context: payload.context,
        metadata: payload.metadata,
        stack: payload.stack,
        ambient: payload.ambient,
        requestId: payload.requestId,
        path: payload.path,
        method: payload.method,
        userAgent: payload.userAgent,
        statusCode: payload.statusCode,
        authenticatedBy: payload.authenticatedBy,
        responseTime: payload.responseTime,
        errorMessage: payload.errorMessage,
      });

      return response.data.logId;
    } catch (error) {
      console.error('Erro ao enviar log:', error);
      throw error;
    }
  }

  async error(message: string, error?: Error, context?: string): Promise<string> {
    return this.log({
      message,
      level: 'ERROR',
      context: context || 'UnknownService',
      metadata: error ? { errorName: error.name } : undefined,
      stack: error?.stack,
    });
  }

  async warn(message: string, context?: string): Promise<string> {
    return this.log({
      message,
      level: 'WARN',
      context: context || 'UnknownService',
    });
  }

  async info(message: string, context?: string): Promise<string> {
    return this.log({
      message,
      level: 'INFO',
      context: context || 'UnknownService',
    });
  }

  async debug(message: string, context?: string, metadata?: any): Promise<string> {
    return this.log({
      message,
      level: 'DEBUG',
      context: context || 'UnknownService',
      metadata,
    });
  }

  async getLogs(limit = 100): Promise<any[]> {
    try {
      const response = await this.client.get('/logs', {
        params: { limit },
      });
      return response.data.logs;
    } catch (error) {
      console.error('Erro ao recuperar logs:', error);
      throw error;
    }
  }

  async getLog(id: string): Promise<any> {
    try {
      const response = await this.client.get(`/logs/${id}`);
      return response.data.log;
    } catch (error) {
      console.error(`Erro ao recuperar log ${id}:`, error);
      throw error;
    }
  }

  async cleanup(daysOld = 30): Promise<number> {
    try {
      const response = await this.client.post('/logs/cleanup', {
        daysOld,
      });
      return response.data.deletedCount;
    } catch (error) {
      console.error('Erro ao limpar logs:', error);
      throw error;
    }
  }

  async sendReport(): Promise<boolean> {
    try {
      const response = await this.client.post('/logs/report/send');
      return response.data.success;
    } catch (error) {
      console.error('Erro ao enviar relatório:', error);
      throw error;
    }
  }
}

// Instância global padrão
let globalLogClient: LogClient;

export function initializeLogClient(apiUrl?: string, apiKey?: string, apiSecret?: string): LogClient {
  globalLogClient = new LogClient(apiUrl, apiKey, apiSecret);
  return globalLogClient;
}

export function getLogClient(): LogClient {
  if (!globalLogClient) {
    globalLogClient = new LogClient();
  }
  return globalLogClient;
}

// Helpers globais
export async function reportLog(payload: LogPayload): Promise<string> {
  return getLogClient().log(payload);
}

export async function reportError(
  message: string,
  error?: Error,
  context?: string,
): Promise<string> {
  return getLogClient().error(message, error, context);
}

export async function reportWarn(message: string, context?: string): Promise<string> {
  return getLogClient().warn(message, context);
}

export async function reportInfo(message: string, context?: string): Promise<string> {
  return getLogClient().info(message, context);
}

export async function reportDebug(
  message: string,
  context?: string,
  metadata?: any,
): Promise<string> {
  return getLogClient().debug(message, context, metadata);
}
