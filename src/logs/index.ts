/**
 * Exporte todos os arquivos do módulo de logs
 */

// Classes
export { LogClient } from './log-client';
export { LogsModule } from './logs.module';
export { LogsMiddleware } from './logs.middleware';
export { LogsInterceptor } from './logs.interceptor';
export { LogContext } from './log-context';
export { LogsProviderFactory } from './logs.provider-factory';
export { BaseService } from './base.service';
export { ExampleLoggingService } from './example-logging.service';
export { Logger } from './logger';

// Tipos
export type {
  LogPayload,
  LogsModuleConfig,
  LogResponse,
  LogClientConfig,
  LoggerOptions,
  LogLevel,
  Environment,
} from './types';

export type { LogContextData, RequestLog } from './log-context';

// Constantes
export {
  DEFAULT_LOG_TIMEOUT,
  DEFAULT_RETRY_ATTEMPTS,
  DEFAULT_RETRY_DELAY,
  DEFAULT_BATCH_SIZE,
  DEFAULT_BATCH_TIMEOUT,
  LOG_LEVELS,
  ENVIRONMENTS,
  HTTP_METHODS,
  DEFAULT_HEADERS,
  LOG_CONTEXT_KEY,
  REQUEST_ID_HEADER,
  TRACE_ID_HEADER,
  CORRELATION_ID_HEADER,
  ERROR_MESSAGES,
} from './constants';
