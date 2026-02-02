"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsModule = void 0;
const common_1 = require("@nestjs/common");
const log_client_1 = require("./log-client");
const log_context_1 = require("./log-context");
const logs_interceptor_1 = require("./logs.interceptor");
const logger_1 = require("./logger");
let LogsModule = (() => {
    let _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({
            providers: [
                log_context_1.LogContext,
                {
                    provide: log_client_1.LogClient,
                    useFactory: async () => {
                        const projectName = process.env.LOGS_PROJECT_NAME || 'NiceTripsAPI';
                        const logsApiUrl = process.env.LOGS_API_URL || 'http://localhost:3000';
                        const ambient = (process.env.LOGS_AMBIENT || 'development');
                        const logClient = new log_client_1.LogClient(logsApiUrl, projectName, ambient);
                        logger_1.Logger.info(`✅ LogClient inicializado para o projeto "${projectName}"`);
                        return logClient;
                    },
                },
                // Interceptor removido do registro automático - precisa ser registrado manualmente
                logs_interceptor_1.LogsInterceptor,
            ],
            exports: [log_client_1.LogClient, log_context_1.LogContext, logs_interceptor_1.LogsInterceptor],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LogsModule = _classThis = class {
        /**
         * Configura o módulo de logs com parâmetros customizados
         *
         * @param config Configuração do módulo (apiUrl, projectName, ambient)
         * @returns DynamicModule
         *
         * @example
         * ```typescript
         * import { LogsModule } from '@evertrips/report-logs-client';
         *
         * @Module({
         *   imports: [
         *     LogsModule.forRoot({
         *       apiUrl: 'http://localhost:3001/logs',
         *       projectName: 'meu-projeto',
         *       ambient: 'development',
         *     }),
         *   ],
         * })
         * export class AppModule {}
         * ```
         */
        static forRoot(config) {
            return {
                module: LogsModule,
                global: true,
                providers: [
                    log_context_1.LogContext,
                    {
                        provide: log_client_1.LogClient,
                        useFactory: async () => {
                            const projectName = config.projectName || process.env.LOGS_PROJECT_NAME || 'DefaultProject';
                            const logsApiUrl = config.apiUrl || process.env.LOGS_API_URL || 'http://localhost:3000/logs';
                            const ambient = (config.ambient || process.env.LOGS_AMBIENT || 'development');
                            const logClient = new log_client_1.LogClient(logsApiUrl, projectName, ambient);
                            logger_1.Logger.info(`✅ LogClient inicializado`, {
                                projectName,
                                apiUrl: logsApiUrl,
                                ambient,
                            });
                            return logClient;
                        },
                    },
                    // Interceptor disponível para registro manual
                    logs_interceptor_1.LogsInterceptor,
                ],
                exports: [log_client_1.LogClient, log_context_1.LogContext, logs_interceptor_1.LogsInterceptor],
            };
        }
    };
    __setFunctionName(_classThis, "LogsModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LogsModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LogsModule = _classThis;
})();
exports.LogsModule = LogsModule;
//# sourceMappingURL=logs.module.js.map