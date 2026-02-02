"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsProviderFactory = exports.LogContext = exports.LogsInterceptor = exports.LogsMiddleware = exports.LogClient = exports.LogsModule = void 0;
// Main export for the Report Logs Client library
__exportStar(require("./logs/index"), exports);
var logs_module_1 = require("./logs/logs.module");
Object.defineProperty(exports, "LogsModule", { enumerable: true, get: function () { return logs_module_1.LogsModule; } });
var log_client_1 = require("./logs/log-client");
Object.defineProperty(exports, "LogClient", { enumerable: true, get: function () { return log_client_1.LogClient; } });
var logs_middleware_1 = require("./logs/logs.middleware");
Object.defineProperty(exports, "LogsMiddleware", { enumerable: true, get: function () { return logs_middleware_1.LogsMiddleware; } });
var logs_interceptor_1 = require("./logs/logs.interceptor");
Object.defineProperty(exports, "LogsInterceptor", { enumerable: true, get: function () { return logs_interceptor_1.LogsInterceptor; } });
var log_context_1 = require("./logs/log-context");
Object.defineProperty(exports, "LogContext", { enumerable: true, get: function () { return log_context_1.LogContext; } });
var logs_provider_factory_1 = require("./logs/logs.provider-factory");
Object.defineProperty(exports, "LogsProviderFactory", { enumerable: true, get: function () { return logs_provider_factory_1.LogsProviderFactory; } });
//# sourceMappingURL=index.js.map