import { Injectable } from '@nestjs/common';
import { LogClient } from './log-client';

/**
 * Service base para integração de logs em todos os serviços
 * 
 * Herde dessa classe nos seus serviços para ter logging automático
 */

@Injectable()
export class BaseService {
  protected serviceName: string;

  constructor(protected readonly logClient: LogClient) {
    this.serviceName = this.constructor.name;
  }

  /**
   * Log de informação com contexto automático
   */
  protected async logInfo(message: string, metadata?: any) {
    await this.logClient.info(message, this.serviceName, metadata);
  }

  /**
   * Log de aviso com contexto automático
   */
  protected async logWarn(message: string, metadata?: any) {
    await this.logClient.warn(message, this.serviceName, metadata);
  }

  /**
   * Log de erro com contexto automático
   */
  protected async logError(message: string, error?: Error | any, metadata?: any) {
    await this.logClient.error(
      message,
      error,
      this.serviceName,
      metadata,
    );
  }

  /**
   * Log de debug com contexto automático
   */
  protected async logDebug(message: string, metadata?: any) {
    await this.logClient.debug(message, this.serviceName, metadata);
  }

  /**
   * Gera novo requestId
   */
  protected generateRequestId(): string {
    return this.logClient.generateRequestId();
  }

  /**
   * Obtém requestId atual
   */
  protected getRequestId(): string {
    return this.logClient.getRequestId();
  }
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
