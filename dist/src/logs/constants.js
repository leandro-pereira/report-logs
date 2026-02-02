"use strict";
/**
 * Constantes para o sistema de logs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.CORRELATION_ID_HEADER = exports.TRACE_ID_HEADER = exports.REQUEST_ID_HEADER = exports.LOG_CONTEXT_KEY = exports.DEFAULT_HEADERS = exports.HTTP_METHODS = exports.ENVIRONMENTS = exports.LOG_LEVELS = exports.DEFAULT_BATCH_TIMEOUT = exports.DEFAULT_BATCH_SIZE = exports.DEFAULT_RETRY_DELAY = exports.DEFAULT_RETRY_ATTEMPTS = exports.DEFAULT_LOG_TIMEOUT = void 0;
exports.DEFAULT_LOG_TIMEOUT = 5000;
exports.DEFAULT_RETRY_ATTEMPTS = 3;
exports.DEFAULT_RETRY_DELAY = 1000;
exports.DEFAULT_BATCH_SIZE = 10;
exports.DEFAULT_BATCH_TIMEOUT = 5000;
exports.LOG_LEVELS = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    DEBUG: 'DEBUG',
};
exports.ENVIRONMENTS = {
    DEVELOPMENT: 'development',
    STAGING: 'staging',
    PRODUCTION: 'production',
};
exports.HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    OPTIONS: 'OPTIONS',
    HEAD: 'HEAD',
};
exports.DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};
exports.LOG_CONTEXT_KEY = 'log_context';
exports.REQUEST_ID_HEADER = 'x-request-id';
exports.TRACE_ID_HEADER = 'x-trace-id';
exports.CORRELATION_ID_HEADER = 'x-correlation-id';
exports.ERROR_MESSAGES = {
    LOGS_API_URL_REQUIRED: 'apiUrl é obrigatório',
    PROJECT_NAME_REQUIRED: 'projectName é obrigatório',
    AMBIENT_REQUIRED: 'ambient é obrigatório',
    INVALID_LOG_LEVEL: 'Log level inválido',
    INVALID_ENVIRONMENT: 'Environment inválido',
    SEND_LOG_FAILED: 'Falha ao enviar log',
    REFRESH_KEY_FAILED: 'Falha ao renovar chave de API',
};
//# sourceMappingURL=constants.js.map