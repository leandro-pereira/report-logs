export interface RequestLog {
    timestamp: number;
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
    message: string;
    context?: string;
    data?: Record<string, any>;
}
export interface LogContextData {
    requestId: string;
    logs: RequestLog[];
}
/**
 * Serviço para gerenciar contexto de logs por request
 * Usa AsyncLocalStorage para manter contexto isolado por requisição
 */
export declare class LogContext {
    private storage;
    /**
     * Inicializa o contexto para uma nova requisição
     */
    initializeContext(requestId?: string): string;
    /**
     * Obtém o requestId da requisição atual
     */
    getRequestId(): string | undefined;
    /**
     * Registra um log no contexto da requisição
     */
    addLog(level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', message: string, context?: string, data?: Record<string, any>): void;
    /**
     * Registra um log de INFO
     */
    info(message: string, context?: string, data?: Record<string, any>): void;
    /**
     * Registra um log de WARN
     */
    warn(message: string, context?: string, data?: Record<string, any>): void;
    /**
     * Registra um log de ERROR
     */
    error(message: string, context?: string, data?: Record<string, any>): void;
    /**
     * Registra um log de DEBUG
     */
    debug(message: string, context?: string, data?: Record<string, any>): void;
    /**
     * Obtém todos os logs registrados na requisição atual
     */
    getLogs(): RequestLog[];
    /**
     * Limpa o contexto (geralmente chamado ao final da requisição)
     */
    clear(): void;
    /**
     * Executa uma função dentro do contexto de uma requisição
     */
    run<T>(requestId: string, fn: () => T): T;
}
//# sourceMappingURL=log-context.d.ts.map