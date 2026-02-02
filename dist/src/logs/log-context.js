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
exports.LogContext = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
/**
 * Serviço para gerenciar contexto de logs por request
 * Versão simplificada compatível com NestJS v9
 */
let LogContext = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LogContext = _classThis = class {
        constructor() {
            this.contextData = {
                requestId: '',
                logs: [],
            };
        }
        /**
         * Define qual request este contexto está vinculado
         */
        setRequest(request) {
            // Armazenar contexto diretamente no request object
            if (!request.__logContext) {
                request.__logContext = {
                    requestId: (0, uuid_1.v4)(),
                    logs: [],
                };
            }
            this.contextData = request.__logContext;
        }
        /**
         * Inicializa o contexto para uma nova requisição
         */
        initializeContext(requestId, request) {
            const id = requestId || (0, uuid_1.v4)();
            if (request) {
                // Se temos o request, usar ele diretamente
                request.__logContext = {
                    requestId: id,
                    logs: [],
                };
                this.contextData = request.__logContext;
            }
            else {
                // Fallback para instância local
                this.contextData = {
                    requestId: id,
                    logs: [],
                };
            }
            return id;
        }
        /**
         * Obtém o requestId da requisição atual
         */
        getRequestId() {
            return this.contextData?.requestId;
        }
        /**
         * Registra um log no contexto da requisição
         */
        addLog(level, message, context, data) {
            if (!this.contextData) {
                console.warn('LogContext não inicializado');
                return;
            }
            this.contextData.logs.push({
                timestamp: Date.now(),
                level,
                message,
                context,
                data,
            });
        }
        /**
         * Registra um log de INFO
         */
        info(message, context, data) {
            this.addLog('INFO', message, context, data);
        }
        /**
         * Registra um log de WARN
         */
        warn(message, context, data) {
            this.addLog('WARN', message, context, data);
        }
        /**
         * Registra um log de ERROR
         */
        error(message, context, data) {
            this.addLog('ERROR', message, context, data);
        }
        /**
         * Registra um log de DEBUG
         */
        debug(message, context, data) {
            this.addLog('DEBUG', message, context, data);
        }
        /**
         * Obtém todos os logs registrados na requisição atual
         */
        getLogs() {
            return this.contextData?.logs || [];
        }
        /**
         * Limpa o contexto (geralmente chamado ao final da requisição)
         */
        clear() {
            if (this.contextData) {
                this.contextData.logs = [];
            }
        }
        /**
         * Executa uma função dentro do contexto de uma requisição
         * @deprecated Use request-scoped injection instead
         */
        run(requestId, fn) {
            // Para compatibilidade, mas não é necessário com request scope
            return fn();
        }
    };
    __setFunctionName(_classThis, "LogContext");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LogContext = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LogContext = _classThis;
})();
exports.LogContext = LogContext;
//# sourceMappingURL=log-context.js.map