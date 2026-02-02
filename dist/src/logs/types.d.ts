/**
 * Tipos e Interfaces para o sistema de logs
 */
export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
export type Environment = 'development' | 'staging' | 'production';
export interface LogPayload {
    message: string;
    level?: LogLevel;
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
    timestamp?: Date;
    projectName?: string;
    hostname?: string;
    pid?: number;
}
export interface LogsModuleConfig {
    apiUrl: string;
    projectName: string;
    ambient: Environment;
    timeout?: number;
    retryAttempts?: number;
    retryDelay?: number;
}
export interface LogResponse {
    id: string;
    message: string;
    level: LogLevel;
    timestamp: Date;
    projectName: string;
    ambient: Environment;
}
export interface LogClientConfig {
    apiUrl: string;
    projectName: string;
    ambient: Environment;
    timeout?: number;
}
export interface LogContext {
    requestId: string;
    userId?: string;
    sessionId?: string;
    correlationId?: string;
    traceId?: string;
}
export interface LoggerOptions {
    enableConsole?: boolean;
    enableRemote?: boolean;
    minLevel?: LogLevel;
    batchSize?: number;
    batchTimeout?: number;
}
//# sourceMappingURL=types.d.ts.map