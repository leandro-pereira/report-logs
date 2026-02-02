import { LogClient } from './log-client';
/**
 * Service base para integração de logs em todos os serviços
 *
 * Herde dessa classe nos seus serviços para ter logging automático
 */
export declare class BaseService {
    protected readonly logClient: LogClient;
    protected serviceName: string;
    constructor(logClient: LogClient);
    /**
     * Log de informação com contexto automático
     */
    protected logInfo(message: string, metadata?: any): Promise<void>;
    /**
     * Log de aviso com contexto automático
     */
    protected logWarn(message: string, metadata?: any): Promise<void>;
    /**
     * Log de erro com contexto automático
     */
    protected logError(message: string, error?: Error | any, metadata?: any): Promise<void>;
    /**
     * Log de debug com contexto automático
     */
    protected logDebug(message: string, metadata?: any): Promise<void>;
    /**
     * Gera novo requestId
     */
    protected generateRequestId(): string;
    /**
     * Obtém requestId atual
     */
    protected getRequestId(): string;
}
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
//# sourceMappingURL=base.service.d.ts.map