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
exports.BaseService = void 0;
const common_1 = require("@nestjs/common");
/**
 * Service base para integração de logs em todos os serviços
 *
 * Herde dessa classe nos seus serviços para ter logging automático
 */
let BaseService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var BaseService = _classThis = class {
        constructor(logClient) {
            this.logClient = logClient;
            this.serviceName = this.constructor.name;
        }
        /**
         * Log de informação com contexto automático
         */
        async logInfo(message, metadata) {
            await this.logClient.info(message, this.serviceName, metadata);
        }
        /**
         * Log de aviso com contexto automático
         */
        async logWarn(message, metadata) {
            await this.logClient.warn(message, this.serviceName, metadata);
        }
        /**
         * Log de erro com contexto automático
         */
        async logError(message, error, metadata) {
            await this.logClient.error(message, error, this.serviceName, metadata);
        }
        /**
         * Log de debug com contexto automático
         */
        async logDebug(message, metadata) {
            await this.logClient.debug(message, this.serviceName, metadata);
        }
        /**
         * Gera novo requestId
         */
        generateRequestId() {
            return this.logClient.generateRequestId();
        }
        /**
         * Obtém requestId atual
         */
        getRequestId() {
            return this.logClient.getRequestId();
        }
    };
    __setFunctionName(_classThis, "BaseService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BaseService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BaseService = _classThis;
})();
exports.BaseService = BaseService;
/**
 * EXEMPLO DE USO:
 *
 *   @Injectable()
 *   export class UserService extends BaseService {
 *     constructor(
 *       private userRepository: UserRepository,
 *       logClient: LogClient,
 *     ) {
 *       super(logClient);
 *     }
 *
 *     async createUser(data: CreateUserDto) {
 *       try {
 *         await this.logInfo('Criando novo usuário', { email: data.email });
 *         const user = await this.userRepository.create(data);
 *         await this.logInfo('Usuário criado', { userId: user.id });
 *         return user;
 *       } catch (error) {
 *         await this.logError('Erro ao criar usuário', error, { email: data.email });
 *         throw error;
 *       }
 *     }
 *   }
 */
//# sourceMappingURL=base.service.js.map