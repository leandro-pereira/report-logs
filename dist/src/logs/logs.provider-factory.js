"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsProviderFactory = void 0;
const core_1 = require("@nestjs/core");
const log_client_1 = require("./log-client");
const log_context_1 = require("./log-context");
const logs_interceptor_1 = require("./logs.interceptor");
const logger_1 = require("./logger");
/**
 * Factory para criar providers do sistema de logs
 * Para ser usado diretamente no AppModule quando a injeção automática não funciona
 */
class LogsProviderFactory {
    /**
     * Cria todos os providers necessários para o sistema de logs
     * Use isso no seu AppModule quando a importação do LogsModule não funcionar
     */
    static createProviders(config) {
        const logClientProvider = {
            provide: log_client_1.LogClient,
            useFactory: () => {
                const logClient = new log_client_1.LogClient(config.apiUrl, config.projectName, config.ambient);
                logger_1.Logger.info(`✅ LogClient inicializado via Factory`, {
                    projectName: config.projectName,
                    apiUrl: config.apiUrl,
                    ambient: config.ambient,
                });
                return logClient;
            },
        };
        const logContextProvider = {
            provide: log_context_1.LogContext,
            useClass: log_context_1.LogContext,
        };
        const interceptorProvider = {
            provide: core_1.APP_INTERCEPTOR,
            useFactory: (logClient, logContext) => {
                return new logs_interceptor_1.LogsInterceptor(logClient, logContext);
            },
            inject: [log_client_1.LogClient, log_context_1.LogContext],
        };
        return [logClientProvider, logContextProvider, interceptorProvider];
    }
    /**
     * Cria providers sem o interceptor automático
     * Use quando quiser registrar o interceptor manualmente
     */
    static createBasicProviders(config) {
        const logClientProvider = {
            provide: log_client_1.LogClient,
            useFactory: () => {
                const logClient = new log_client_1.LogClient(config.apiUrl, config.projectName, config.ambient);
                console.log(`✅ LogClient inicializado via BasicFactory - ${config.projectName}`);
                return logClient;
            },
        };
        const logContextProvider = {
            provide: log_context_1.LogContext,
            useClass: log_context_1.LogContext,
        };
        return [logClientProvider, logContextProvider, logs_interceptor_1.LogsInterceptor];
    }
}
exports.LogsProviderFactory = LogsProviderFactory;
//# sourceMappingURL=logs.provider-factory.js.map