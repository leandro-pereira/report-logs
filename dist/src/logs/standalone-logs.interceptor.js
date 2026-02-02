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
exports.StandaloneLogsInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const uuid_1 = require("uuid");
/**
 * Interceptor auto-suficiente que não depende de injeção de dependência
 * Funciona de forma independente mesmo sem LogsModule
 */
let StandaloneLogsInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var StandaloneLogsInterceptor = _classThis = class {
        /**
         * Configura o interceptor estaticamente
         */
        static configure(config) {
            StandaloneLogsInterceptor.config = config;
            console.log(`✅ StandaloneLogsInterceptor configurado para ${config.projectName}`);
        }
        intercept(context, next) {
            console.log('🚀 StandaloneLogsInterceptor: Interceptando request...');
            const request = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();
            // Gerar requestId único
            const requestId = (0, uuid_1.v4)();
            const startTime = Date.now();
            console.log(`📋 Request ID gerado: ${requestId} para ${request.method} ${request.path}`);
            // Inicializar contexto diretamente no request
            const logContext = {
                requestId,
                logs: [],
            };
            // Anexar ao request
            request.requestId = requestId;
            request.logContext = logContext;
            console.log(`💾 Contexto anexado ao request:`, { requestId, hasLogContext: !!request.logContext });
            // Helper functions para logging
            const addLog = (level, message, context, data) => {
                console.log(`📝 Adicionando log [${level}]: ${message}`);
                logContext.logs.push({
                    timestamp: Date.now(),
                    level,
                    message,
                    context,
                    data,
                });
            };
            // Anexar helpers ao request
            request.logInfo = (message, context, data) => {
                console.log(`ℹ️ logInfo chamado: ${message}`);
                addLog('INFO', message, context, data);
            };
            request.logWarn = (message, context, data) => {
                console.log(`⚠️ logWarn chamado: ${message}`);
                addLog('WARN', message, context, data);
            };
            request.logError = (message, context, data) => {
                console.log(`❌ logError chamado: ${message}`);
                addLog('ERROR', message, context, data);
            };
            request.logDebug = (message, context, data) => {
                console.log(`🐛 logDebug chamado: ${message}`);
                addLog('DEBUG', message, context, data);
            };
            // Log inicial
            const method = request.method;
            const path = request.path;
            const userAgent = request.get('user-agent');
            console.log(`🏁 Iniciando log para: ${method} ${path}`);
            addLog('DEBUG', `Iniciando ${method} ${path}`, 'HttpRequest', { userAgent });
            return next.handle().pipe((0, operators_1.tap)((data) => {
                console.log(`✅ Request finalizada com sucesso: ${method} ${path}`);
                this.handleSuccess(request, response, requestId, startTime, logContext);
            }), (0, operators_1.catchError)((error) => {
                console.log(`❌ Request finalizada com erro: ${method} ${path} - ${error.message}`);
                this.handleError(request, response, requestId, startTime, error, logContext);
                throw error;
            }));
        }
        async handleSuccess(request, response, requestId, startTime, logContext) {
            try {
                console.log(`🎯 Processando sucesso para request ${requestId}`);
                const duration = Date.now() - startTime;
                const statusCode = response.statusCode || 200;
                const method = request.method;
                const path = request.path;
                console.log(`📊 Estatísticas: ${method} ${path} - ${statusCode} - ${duration}ms`);
                console.log(`📋 Total de logs coletados: ${logContext.logs.length}`);
                logContext.logs.push({
                    timestamp: Date.now(),
                    level: 'DEBUG',
                    message: `Finalizando ${method} ${path} com status ${statusCode}`,
                    context: 'HttpRequest',
                    data: { duration, statusCode },
                });
                // Enviar logs se configurado
                if (StandaloneLogsInterceptor.config) {
                    console.log(`📤 Enviando logs para: ${StandaloneLogsInterceptor.config.apiUrl}`);
                    await this.sendLogs(requestId, method, path, statusCode, duration, request, logContext, null);
                }
                else {
                    console.log(`⚠️ StandaloneLogsInterceptor não configurado - logs não enviados`);
                }
            }
            catch (error) {
                console.error('❌ Erro ao processar logs de sucesso:', error);
            }
        }
        async handleError(request, response, requestId, startTime, error, logContext) {
            try {
                const duration = Date.now() - startTime;
                const statusCode = error.status || response.statusCode || 500;
                const method = request.method;
                const path = request.path;
                const errorMessage = error.message || 'Erro desconhecido';
                logContext.logs.push({
                    timestamp: Date.now(),
                    level: 'ERROR',
                    message: `Erro em ${method} ${path}`,
                    context: 'HttpRequest',
                    data: { error: errorMessage, statusCode },
                });
                // Enviar logs se configurado
                if (StandaloneLogsInterceptor.config) {
                    await this.sendLogs(requestId, method, path, statusCode, duration, request, logContext, error);
                }
            }
            catch (loggingError) {
                console.error('❌ Erro ao processar logs de erro:', loggingError);
            }
        }
        async sendLogs(requestId, method, path, statusCode, duration, request, logContext, error = null) {
            try {
                const config = StandaloneLogsInterceptor.config;
                const userAgent = request.get('user-agent');
                const authenticatedBy = request.user?.id || request.get('authorization');
                const logPayload = {
                    requestId,
                    message: error
                        ? `${method} ${path} - ${statusCode} - ${error.message}`
                        : `${method} ${path} - ${statusCode}`,
                    level: error ? 'ERROR' : (statusCode >= 400 ? 'WARN' : 'INFO'),
                    context: 'HttpRequest',
                    path,
                    method,
                    statusCode,
                    userAgent,
                    authenticatedBy,
                    responseTime: duration,
                    errorMessage: error?.message,
                    stack: error?.stack,
                    ambient: config.ambient,
                    projectName: config.projectName,
                    timestamp: new Date(),
                    metadata: {
                        request: {
                            body: request.body,
                            query: request.query,
                            params: request.params,
                        },
                        collectedLogs: logContext.logs,
                        ...(error && {
                            error: {
                                message: error.message,
                                name: error.name,
                                statusCode: error.status,
                            }
                        })
                    },
                };
                // Enviar para API (usando fetch nativo do Node.js)
                await fetch(config.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(logPayload),
                }).catch(err => {
                    console.warn('⚠️ Falha ao enviar logs:', err.message);
                });
            }
            catch (error) {
                console.warn('⚠️ Erro ao enviar logs:', error);
            }
        }
    };
    __setFunctionName(_classThis, "StandaloneLogsInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StandaloneLogsInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.config = null;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StandaloneLogsInterceptor = _classThis;
})();
exports.StandaloneLogsInterceptor = StandaloneLogsInterceptor;
//# sourceMappingURL=standalone-logs.interceptor.js.map