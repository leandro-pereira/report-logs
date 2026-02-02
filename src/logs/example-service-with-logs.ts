import { Injectable } from '@nestjs/common';
import { LogContext } from './log-context';

/**
 * Exemplo de como usar LogContext em um serviço
 * 
 * Todos os logs registrados aqui serão coletados pelo interceptor
 * e enviados junto com o log final da requisição usando o mesmo requestId
 */
@Injectable()
export class ExampleServiceWithLogs {
  constructor(private logContext: LogContext) {}

  async processUserCreation(userData: any) {
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
    } catch (error) {
      // Log de erro com contexto
      this.logContext.error(
        'Erro ao criar usuário',
        'UserService',
        {
          email: userData.email,
          error: (error as any).message || String(error),
        },
      );
      throw error;
    }
  }

  private async validateUserData(userData: any) {
    this.logContext.debug('Validando dados do usuário', 'UserService', {
      fields: Object.keys(userData),
    });

    // Validação aqui...
    if (!userData.email) {
      throw new Error('Email é obrigatório');
    }
  }

  private async checkEmailExists(email: string) {
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

  private async saveUserToDatabase(userData: any) {
    this.logContext.debug('Salvando usuário no banco de dados', 'UserService');

    // Simulando save...
    return {
      id: '123',
      email: userData.email,
      name: userData.name,
      createdAt: new Date(),
    };
  }
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
