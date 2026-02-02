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
export declare class LogClient {
    private logsApiUrl;
    private projectName;
    private ambient;
    private axiosInstance;
    private requestId;
    private isRefreshingKey;
    private apiKey;
    private apiSecret;
    private isInitialized;
    private initializationPromise;
    constructor(logsApiUrl: string, projectName: string, ambient?: 'development' | 'staging' | 'production');
    /**
     * Aguarda a inicialização das credenciais
     */
    private waitForInitialization;
    /**
     * Inicializa as credenciais fazendo uma request para obter a API Key
     */
    private initializeCredentials;
    /**
     * Cria uma nova instância do axios com os headers atualizados
     */
    private createAxiosInstance;
    /**
     * Gera um novo ID de requisição
     */
    generateRequestId(): string;
    /**
     * Retorna o ID da requisição atual
     */
    getRequestId(): string;
    /**
     * Obtém uma nova API Key do servidor
     */
    private refreshApiKey;
    /**
     * Envia um log para a aplicação Report Logs com retry automático
     */
    sendLog(payload: LogPayload, retryCount?: number): Promise<string>;
    /**
     * Envia um log de INFO
     */
    info(message: string, context?: string, metadata?: any, logPayload?: Partial<LogPayload>): Promise<string>;
    /**
     * Envia um log de WARN
     */
    warn(message: string, context?: string, metadata?: any, logPayload?: Partial<LogPayload>): Promise<string>;
    /**
     * Envia um log de ERROR
     */
    error(message: string, error?: Error | any, context?: string, metadata?: any, stack?: string, logPayload?: Partial<LogPayload>): Promise<string>;
    /**
     * Envia um log de DEBUG
     */
    debug(message: string, context?: string, metadata?: any, logPayload?: Partial<LogPayload>): Promise<string>;
}
//# sourceMappingURL=log-client.d.ts.map