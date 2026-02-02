/**
 * Constantes para o sistema de logs
 */

export const DEFAULT_LOG_TIMEOUT = 5000;
export const DEFAULT_RETRY_ATTEMPTS = 3;
export const DEFAULT_RETRY_DELAY = 1000;
export const DEFAULT_BATCH_SIZE = 10;
export const DEFAULT_BATCH_TIMEOUT = 5000;

export const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
} as const;

export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
} as const;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;

export const LOG_CONTEXT_KEY = 'log_context';
export const REQUEST_ID_HEADER = 'x-request-id';
export const TRACE_ID_HEADER = 'x-trace-id';
export const CORRELATION_ID_HEADER = 'x-correlation-id';

export const ERROR_MESSAGES = {
  LOGS_API_URL_REQUIRED: 'apiUrl é obrigatório',
  PROJECT_NAME_REQUIRED: 'projectName é obrigatório',
  AMBIENT_REQUIRED: 'ambient é obrigatório',
  INVALID_LOG_LEVEL: 'Log level inválido',
  INVALID_ENVIRONMENT: 'Environment inválido',
  SEND_LOG_FAILED: 'Falha ao enviar log',
  REFRESH_KEY_FAILED: 'Falha ao renovar chave de API',
} as const;
