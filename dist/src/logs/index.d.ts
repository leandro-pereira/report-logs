/**
 * Exporte todos os arquivos do módulo de logs
 */
export { LogClient } from './log-client';
export { LogsModule } from './logs.module';
export { LogsMiddleware } from './logs.middleware';
export { LogsInterceptor } from './logs.interceptor';
export { BaseService } from './base.service';
export { ExampleLoggingService } from './example-logging.service';
export { Logger } from './logger';
export type { LogPayload, LogsModuleConfig, LogResponse, LogClientConfig, LogContext, LoggerOptions, LogLevel, Environment, } from './types';
export type { LogContext as LogContextData, RequestLog } from './log-context';
export { DEFAULT_LOG_TIMEOUT, DEFAULT_RETRY_ATTEMPTS, DEFAULT_RETRY_DELAY, DEFAULT_BATCH_SIZE, DEFAULT_BATCH_TIMEOUT, LOG_LEVELS, ENVIRONMENTS, HTTP_METHODS, DEFAULT_HEADERS, LOG_CONTEXT_KEY, REQUEST_ID_HEADER, TRACE_ID_HEADER, CORRELATION_ID_HEADER, ERROR_MESSAGES, } from './constants';
//# sourceMappingURL=index.d.ts.map