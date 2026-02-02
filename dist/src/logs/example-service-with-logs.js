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
exports.ExampleServiceWithLogs = void 0;
const common_1 = require("@nestjs/common");
/**
 * Exemplo de como usar LogContext em um serviço
 *
 * Todos os logs registrados aqui serão coletados pelo interceptor
 * e enviados junto com o log final da requisição usando o mesmo requestId
 */
let ExampleServiceWithLogs = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ExampleServiceWithLogs = _classThis = class {
        constructor(logContext) {
            this.logContext = logContext;
        }
        async processUserCreation(userData) {
            const requestId = this.logContext.getRequestId();
            try {
                // Log do início do processamento
                this.logContext.info('Iniciando criação de usuário', 'UserService', {
                    email: userData.email,
                });
                // Simulando uma etapa do processamento
                await this.validateUserData(userData);
                // Simulando outra etapa
                await this.checkEmailExists(userData.email);
                // Simulando criação no banco
                const createdUser = await this.saveUserToDatabase(userData);
                // Log de sucesso
                this.logContext.info('Usuário criado com sucesso', 'UserService', {
                    userId: createdUser.id,
                    email: createdUser.email,
                });
                return createdUser;
            }
            catch (error) {
                // Log de erro com contexto
                this.logContext.error('Erro ao criar usuário', 'UserService', {
                    email: userData.email,
                    error: error.message || String(error),
                });
                throw error;
            }
        }
        async validateUserData(userData) {
            this.logContext.debug('Validando dados do usuário', 'UserService', {
                fields: Object.keys(userData),
            });
            // Validação aqui...
            if (!userData.email) {
                throw new Error('Email é obrigatório');
            }
        }
        async checkEmailExists(email) {
            this.logContext.debug('Verificando se email já existe', 'UserService', {
                email,
            });
            // Verificação aqui...
            const exists = Math.random() > 0.9; // Simulação
            if (exists) {
                this.logContext.warn('Email já existe no sistema', 'UserService', {
                    email,
                });
                throw new Error('Email já cadastrado');
            }
        }
        async saveUserToDatabase(userData) {
            this.logContext.debug('Salvando usuário no banco de dados', 'UserService');
            // Simulando save...
            return {
                id: '123',
                email: userData.email,
                name: userData.name,
                createdAt: new Date(),
            };
        }
    };
    __setFunctionName(_classThis, "ExampleServiceWithLogs");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExampleServiceWithLogs = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExampleServiceWithLogs = _classThis;
})();
exports.ExampleServiceWithLogs = ExampleServiceWithLogs;
/**
 * Exemplo de uso em um Controller:
 *
 * @Controller('users')
 * export class UsersController {
 *   constructor(
 *     private userService: ExampleServiceWithLogs,
 *     private logContext: LogContext,
 *   ) {}
 *
 *   @Post()
 *   async create(@Body() createUserDto: CreateUserDto, @Req() request: any) {
 *     // O requestId já está disponível
 *     const requestId = this.logContext.getRequestId();
 *
 *     // Log manual se necessário
 *     this.logContext.info('Recebida requisição de criação de usuário', 'UsersController', {
 *       email: createUserDto.email,
 *     });
 *
 *     // Chamar o serviço - todos os logs dele serão coletados automaticamente
 *     const user = await this.userService.processUserCreation(createUserDto);
 *
 *     // Log de sucesso
 *     this.logContext.info('Usuário retornado ao cliente', 'UsersController', {
 *       userId: user.id,
 *     });
 *
 *     return user;
 *   }
 * }
 *
 * Resultado no serviço de logs (tudo com o mesmo requestId):
 * {
 *   requestId: "uuid-aqui",
 *   message: "POST /users - 201 - Created",
 *   level: "INFO",
 *   method: "POST",
 *   path: "/users",
 *   statusCode: 201,
 *   responseTime: 125,
 *   metadata: {
 *     request: { body: {...} },
 *     response: { id: '123', ... },
 *     collectedLogs: [
 *       { timestamp: ..., level: "INFO", message: "Recebida requisição de criação de usuário", ... },
 *       { timestamp: ..., level: "INFO", message: "Iniciando criação de usuário", ... },
 *       { timestamp: ..., level: "DEBUG", message: "Validando dados do usuário", ... },
 *       { timestamp: ..., level: "DEBUG", message: "Verificando se email já existe", ... },
 *       { timestamp: ..., level: "DEBUG", message: "Salvando usuário no banco de dados", ... },
 *       { timestamp: ..., level: "INFO", message: "Usuário criado com sucesso", ... },
 *       { timestamp: ..., level: "INFO", message: "Usuário retornado ao cliente", ... },
 *     ]
 *   }
 * }
 */
//# sourceMappingURL=example-service-with-logs.js.map