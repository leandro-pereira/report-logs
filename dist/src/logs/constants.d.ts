/**
 * Constantes para o sistema de logs
 */
export declare const DEFAULT_LOG_TIMEOUT = 5000;
export declare const DEFAULT_RETRY_ATTEMPTS = 3;
export declare const DEFAULT_RETRY_DELAY = 1000;
export declare const DEFAULT_BATCH_SIZE = 10;
export declare const DEFAULT_BATCH_TIMEOUT = 5000;
export declare const LOG_LEVELS: {
    readonly INFO: "INFO";
    readonly WARN: "WARN";
    readonly ERROR: "ERROR";
    readonly DEBUG: "DEBUG";
};
export declare const ENVIRONMENTS: {
    readonly DEVELOPMENT: "development";
    readonly STAGING: "staging";
    readonly PRODUCTION: "production";
};
export declare const HTTP_METHODS: {
    readonly GET: "GET";
    readonly POST: "POST";
    readonly PUT: "PUT";
    readonly PATCH: "PATCH";
    readonly DELETE: "DELETE";
    readonly OPTIONS: "OPTIONS";
    readonly HEAD: "HEAD";
};
export declare const DEFAULT_HEADERS: {
    readonly 'Content-Type': "application/json";
    readonly Accept: "application/json";
};
export declare const LOG_CONTEXT_KEY = "log_context";
export declare const REQUEST_ID_HEADER = "x-request-id";
export declare const TRACE_ID_HEADER = "x-trace-id";
export declare const CORRELATION_ID_HEADER = "x-correlation-id";
export declare const ERROR_MESSAGES: {
    readonly LOGS_API_URL_REQUIRED: "apiUrl é obrigatório";
    readonly PROJECT_NAME_REQUIRED: "projectName é obrigatório";
    readonly AMBIENT_REQUIRED: "ambient é obrigatório";
    readonly INVALID_LOG_LEVEL: "Log level inválido";
    readonly INVALID_ENVIRONMENT: "Environment inválido";
    readonly SEND_LOG_FAILED: "Falha ao enviar log";
    readonly REFRESH_KEY_FAILED: "Falha ao renovar chave de API";
};
//# sourceMappingURL=constants.d.ts.map