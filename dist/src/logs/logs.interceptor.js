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
exports.LogsInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const uuid_1 = require("uuid");
/**
 * Interceptor global que:
 * 1. Gera um requestId único no início de cada requisição
 * 2. Armazena no contexto para uso durante a execução
 * 3. Coleta todos os logs da requisição
 * 4. Envia tudo para o serviço de logs ao final
 */
let LogsInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LogsInterceptor = _classThis = class {
        constructor(logClient, logContext) {
            this.logClient = logClient;
            this.logContext = logContext;
        }
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();
            // Gerar requestId único para essa requisição
            const requestId = (0, uuid_1.v4)();
            this.logContext.initializeContext(requestId);
            // Anexar requestId ao request para fácil acesso
            request.requestId = requestId;
            request.logContext = this.logContext;
            // Registrar início da requisição
            const startTime = Date.now();
            const method = request.method;
            const path = request.path;
            const userAgent = request.get('user-agent');
            // Log de início (opcional)
            this.logContext.debug(`Iniciando ${method} ${path}`, 'HttpRequest', {
                userAgent,
            });
            return next.handle().pipe((0, operators_1.tap)((data) => {
                // Requisição bem-sucedida
                this.handleSuccessResponse(request, response, requestId, startTime, data);
            }), (0, operators_1.catchError)((error) => {
                // Erro durante a requisição
                this.handleErrorResponse(request, response, requestId, startTime, error);
                throw error;
            }));
        }
        /**
         * Manipula respostas bem-sucedidas
         */
        async handleSuccessResponse(request, response, requestId, startTime, data) {
            const duration = Date.now() - startTime;
            const statusCode = response.statusCode || 200;
            const method = request.method;
            const path = request.path;
            const userAgent = request.get('user-agent');
            const authenticatedBy = request.user?.id || request.get('authorization');
            // Registrar conclusão
            this.logContext.debug(`Finalizando ${method} ${path} com status ${statusCode}`, 'HttpRequest', {
                duration,
                statusCode,
            });
            // Coletar todos os logs registrados durante a execução
            const collectedLogs = this.logContext.getLogs();
            // Enviar para o serviço de logs
            await this.logClient.sendLog({
                requestId,
                message: `${method} ${path} - ${statusCode}`,
                level: statusCode >= 400 ? 'WARN' : 'INFO',
                context: 'HttpRequest',
                path,
                method,
                statusCode,
                userAgent,
                authenticatedBy,
                responseTime: duration,
                metadata: {
                    request: {
                        body: request.body,
                        query: request.query,
                        params: request.params,
                    },
                    collectedLogs,
                },
            });
            this.logContext.clear();
        }
        /**
         * Manipula erros durante a requisição
         */
        async handleErrorResponse(request, response, requestId, startTime, error) {
            const duration = Date.now() - startTime;
            const statusCode = error.status || response.statusCode || 500;
            const method = request.method;
            const path = request.path;
            const userAgent = request.get('user-agent');
            const authenticatedBy = request.user?.id || request.get('authorization');
            const errorMessage = error.message || 'Erro desconhecido';
            // Registrar erro
            this.logContext.error(`Erro em ${method} ${path}`, 'HttpRequest', {
                error: errorMessage,
                statusCode,
            });
            // Coletar todos os logs registrados durante a execução
            const collectedLogs = this.logContext.getLogs();
            // Enviar para o serviço de logs
            await this.logClient.sendLog({
                requestId,
                message: `${method} ${path} - ${statusCode} - ${errorMessage}`,
                level: 'ERROR',
                context: 'HttpRequest',
                path,
                method,
                statusCode,
                userAgent,
                authenticatedBy,
                responseTime: duration,
                errorMessage,
                stack: error.stack,
                metadata: {
                    request: {
                        body: request.body,
                        query: request.query,
                        params: request.params,
                    },
                    error: {
                        message: error.message,
                        name: error.name,
                        statusCode: error.status,
                    },
                    collectedLogs,
                },
            });
            this.logContext.clear();
        }
    };
    __setFunctionName(_classThis, "LogsInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LogsInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LogsInterceptor = _classThis;
})();
exports.LogsInterceptor = LogsInterceptor;
//# sourceMappingURL=logs.interceptor.js.map