import { LogContext } from './log-context';
/**
 * Exemplo de como usar LogContext em um serviço
 *
 * Todos os logs registrados aqui serão coletados pelo interceptor
 * e enviados junto com o log final da requisição usando o mesmo requestId
 */
export declare class ExampleServiceWithLogs {
    private logContext;
    constructor(logContext: LogContext);
    processUserCreation(userData: any): Promise<{
        id: string;
        email: any;
        name: any;
        createdAt: Date;
    }>;
    private validateUserData;
    private checkEmailExists;
    private saveUserToDatabase;
}
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
//# sourceMappingURL=example-service-with-logs.d.ts.map