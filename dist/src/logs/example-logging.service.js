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
exports.ExampleLoggingService = void 0;
const common_1 = require("@nestjs/common");
/**
 * Exemplo de como usar LogClient em seus serviços
 *
 * O LogClient está disponível globalmente em todos os serviços NestJS
 * através da injeção de dependência.
 */
let ExampleLoggingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ExampleLoggingService = _classThis = class {
        constructor(logClient) {
            this.logClient = logClient;
        }
        /**
         * Exemplo 1: Log simples de informação
         */
        async exampleSimpleLog() {
            await this.logClient.info('Aplicação iniciada com sucesso', 'ExampleService');
        }
        /**
         * Exemplo 2: Log com metadados
         */
        async exampleLogWithMetadata(userId, email) {
            await this.logClient.info('Usuário fez login', 'AuthService', {
                userId,
                email,
                timestamp: new Date().toISOString(),
            });
        }
        /**
         * Exemplo 3: Log de erro com stack trace
         */
        async exampleErrorLog(orderId) {
            try {
                // Simular erro
                throw new Error('Falha ao processar pagamento');
            }
            catch (error) {
                await this.logClient.error(`Erro ao processar pagamento do pedido ${orderId}`, error, 'PaymentService', {
                    orderId,
                    timestamp: new Date().toISOString(),
                });
            }
        }
        /**
         * Exemplo 4: Log de aviso
         */
        async exampleWarnLog(remainingBalance) {
            if (remainingBalance < 100) {
                await this.logClient.warn('Saldo baixo detectado', 'AccountService', {
                    remainingBalance,
                    threshold: 100,
                });
            }
        }
        /**
         * Exemplo 5: Log de debug
         */
        async exampleDebugLog(data) {
            await this.logClient.debug('Dados processados', 'ProcessingService', {
                dataSize: JSON.stringify(data).length,
                keys: Object.keys(data),
            });
        }
        /**
         * Exemplo 6: Usando requestId para rastrear uma requisição
         */
        async exampleWithRequestId() {
            // Gerar novo requestId
            const requestId = this.logClient.generateRequestId();
            // Log 1 - Início
            await this.logClient.sendLog({
                requestId,
                message: 'Iniciando processamento',
                level: 'INFO',
                context: 'OrderProcessing',
                metadata: { orderId: '12345' },
            });
            // Simulação de processamento
            // ... seu código aqui ...
            // Log 2 - Sucesso
            await this.logClient.sendLog({
                requestId,
                message: 'Processamento concluído',
                level: 'INFO',
                context: 'OrderProcessing',
                metadata: { orderId: '12345', duration: '2.5s' },
            });
        }
        /**
         * Exemplo 7: Log de processo com múltiplos passos
         */
        async exampleMultiStepProcess(tripId) {
            const requestId = this.logClient.generateRequestId();
            try {
                // Passo 1
                await this.logClient.info('Iniciando validação de viagem', 'TripService', { requestId, tripId, step: 1 });
                // Passo 2
                await this.logClient.info('Validando disponibilidade', 'TripService', { requestId, tripId, step: 2 });
                // Passo 3
                await this.logClient.info('Confirmando reserva', 'TripService', { requestId, tripId, step: 3 });
                // Conclusão
                await this.logClient.info('Viagem processada com sucesso', 'TripService', { requestId, tripId, status: 'completed' });
            }
            catch (error) {
                await this.logClient.error('Erro ao processar viagem', error, 'TripService', { requestId, tripId, status: 'failed' });
            }
        }
    };
    __setFunctionName(_classThis, "ExampleLoggingService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExampleLoggingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExampleLoggingService = _classThis;
})();
exports.ExampleLoggingService = ExampleLoggingService;
/**
 * PADRÕES RECOMENDADOS:
 *
 * 1. SEMPRE use context para identificar o serviço/módulo
 * 2. SEMPRE use metadata para adicionar contexto útil
 * 3. Use requestId para rastrear requisições multipassos
 * 4. Log de erro SEMPRE deve incluir o objeto error
 * 5. Não envie dados sensíveis (senhas, tokens, etc)
 *
 * EXEMPLO DE USO EM UM CONTROLLER:
 *
 *   @Post('login')
 *   async login(@Body() dto: LoginDto) {
 *     const requestId = this.logClient.generateRequestId();
 *     try {
 *       const result = await this.authService.login(dto.email, dto.password);
 *       await this.logClient.info(
 *         `Login bem-sucedido para ${dto.email}`,
 *         'AuthController',
 *         { requestId, email: dto.email }
 *       );
 *       return result;
 *     } catch (error) {
 *       await this.logClient.error(
 *         `Falha no login para ${dto.email}`,
 *         error,
 *         'AuthController',
 *         { requestId, email: dto.email }
 *       );
 *       throw error;
 *     }
 *   }
 */
//# sourceMappingURL=example-logging.service.js.map