"use strict";
/**
 * Exporte todos os arquivos do módulo de logs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.CORRELATION_ID_HEADER = exports.TRACE_ID_HEADER = exports.REQUEST_ID_HEADER = exports.LOG_CONTEXT_KEY = exports.DEFAULT_HEADERS = exports.HTTP_METHODS = exports.ENVIRONMENTS = exports.LOG_LEVELS = exports.DEFAULT_BATCH_TIMEOUT = exports.DEFAULT_BATCH_SIZE = exports.DEFAULT_RETRY_DELAY = exports.DEFAULT_RETRY_ATTEMPTS = exports.DEFAULT_LOG_TIMEOUT = exports.Logger = exports.ExampleLoggingService = exports.BaseService = exports.LogsInterceptor = exports.LogsMiddleware = exports.LogsModule = exports.LogClient = void 0;
// Classes
var log_client_1 = require("./log-client");
Object.defineProperty(exports, "LogClient", { enumerable: true, get: function () { return log_client_1.LogClient; } });
var logs_module_1 = require("./logs.module");
Object.defineProperty(exports, "LogsModule", { enumerable: true, get: function () { return logs_module_1.LogsModule; } });
var logs_middleware_1 = require("./logs.middleware");
Object.defineProperty(exports, "LogsMiddleware", { enumerable: true, get: function () { return logs_middleware_1.LogsMiddleware; } });
var logs_interceptor_1 = require("./logs.interceptor");
Object.defineProperty(exports, "LogsInterceptor", { enumerable: true, get: function () { return logs_interceptor_1.LogsInterceptor; } });
var base_service_1 = require("./base.service");
Object.defineProperty(exports, "BaseService", { enumerable: true, get: function () { return base_service_1.BaseService; } });
var example_logging_service_1 = require("./example-logging.service");
Object.defineProperty(exports, "ExampleLoggingService", { enumerable: true, get: function () { return example_logging_service_1.ExampleLoggingService; } });
var logger_1 = require("./logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return logger_1.Logger; } });
// Constantes
var constants_1 = require("./constants");
Object.defineProperty(exports, "DEFAULT_LOG_TIMEOUT", { enumerable: true, get: function () { return constants_1.DEFAULT_LOG_TIMEOUT; } });
Object.defineProperty(exports, "DEFAULT_RETRY_ATTEMPTS", { enumerable: true, get: function () { return constants_1.DEFAULT_RETRY_ATTEMPTS; } });
Object.defineProperty(exports, "DEFAULT_RETRY_DELAY", { enumerable: true, get: function () { return constants_1.DEFAULT_RETRY_DELAY; } });
Object.defineProperty(exports, "DEFAULT_BATCH_SIZE", { enumerable: true, get: function () { return constants_1.DEFAULT_BATCH_SIZE; } });
Object.defineProperty(exports, "DEFAULT_BATCH_TIMEOUT", { enumerable: true, get: function () { return constants_1.DEFAULT_BATCH_TIMEOUT; } });
Object.defineProperty(exports, "LOG_LEVELS", { enumerable: true, get: function () { return constants_1.LOG_LEVELS; } });
Object.defineProperty(exports, "ENVIRONMENTS", { enumerable: true, get: function () { return constants_1.ENVIRONMENTS; } });
Object.defineProperty(exports, "HTTP_METHODS", { enumerable: true, get: function () { return constants_1.HTTP_METHODS; } });
Object.defineProperty(exports, "DEFAULT_HEADERS", { enumerable: true, get: function () { return constants_1.DEFAULT_HEADERS; } });
Object.defineProperty(exports, "LOG_CONTEXT_KEY", { enumerable: true, get: function () { return constants_1.LOG_CONTEXT_KEY; } });
Object.defineProperty(exports, "REQUEST_ID_HEADER", { enumerable: true, get: function () { return constants_1.REQUEST_ID_HEADER; } });
Object.defineProperty(exports, "TRACE_ID_HEADER", { enumerable: true, get: function () { return constants_1.TRACE_ID_HEADER; } });
Object.defineProperty(exports, "CORRELATION_ID_HEADER", { enumerable: true, get: function () { return constants_1.CORRELATION_ID_HEADER; } });
Object.defineProperty(exports, "ERROR_MESSAGES", { enumerable: true, get: function () { return constants_1.ERROR_MESSAGES; } });
//# sourceMappingURL=index.js.map