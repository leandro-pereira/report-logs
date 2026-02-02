# 📘 Exemplos de Uso - Report Logs Client

## Exemplo 1: Configuração Básica

### AppModule

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { LogsModule } from '@evertrips/report-logs-client';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    LogsModule.forRoot({
      apiUrl: 'http://localhost:3001/logs',
      projectName: 'meu-backend',
      ambient: 'development',
    }),
    UserModule,
  ],
})
export class AppModule {}
```

## Exemplo 2: Service com LogClient

```typescript
// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { LogClient } from '@evertrips/report-logs-client';

@Injectable()
export class UserService {
  constructor(private readonly logClient: LogClient) {}

  async createUser(email: string, name: string) {
    try {
      this.logClient.info('Iniciando criação de usuário', {
        email,
        name,
      });

      // Simular processamento
      const user = { id: 1, email, name, createdAt: new Date() };

      this.logClient.info('Usuário criado com sucesso', {
        userId: user.id,
        email: user.email,
      });

      return user;
    } catch (error) {
      this.logClient.error('Erro ao criar usuário', {
        email,
        errorMessage: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async updateUser(id: number, data: any) {
    try {
      this.logClient.debug('Atualizando usuário', { userId: id, data });

      // Simular atualização
      const user = { id, ...data, updatedAt: new Date() };

      this.logClient.info('Usuário atualizado', {
        userId: id,
        updatedAt: user.updatedAt,
      });

      return user;
    } catch (error) {
      this.logClient.warn('Falha na atualização', {
        userId: id,
        reason: error.message,
      });
      throw error;
    }
  }

  async deleteUser(id: number) {
    try {
      this.logClient.info('Deletando usuário', { userId: id });

      // Simular deleção
      const result = { success: true, userId: id, deletedAt: new Date() };

      this.logClient.info('Usuário deletado com sucesso', result);

      return result;
    } catch (error) {
      this.logClient.error('Erro ao deletar usuário', {
        userId: id,
        error: error.message,
      });
      throw error;
    }
  }
}
```

## Exemplo 3: Controller com Logs

```typescript
// src/user/user.controller.ts
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { LogClient } from '@evertrips/report-logs-client';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logClient: LogClient,
  ) {}

  @Post()
  async create(@Body() createUserDto: any) {
    this.logClient.debug('POST /users chamado', { dto: createUserDto });
    return this.userService.createUser(createUserDto.email, createUserDto.name);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logClient.debug('GET /users/:id chamado', { id });
    // Implementar findOne
    return { id, name: 'User' };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    this.logClient.debug('PUT /users/:id chamado', { id, dto: updateUserDto });
    return this.userService.updateUser(parseInt(id), updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logClient.debug('DELETE /users/:id chamado', { id });
    return this.userService.deleteUser(parseInt(id));
  }
}
```

## Exemplo 4: Com Middleware

```typescript
// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LogsModule, LogsMiddleware } from '@evertrips/report-logs-client';

@Module({
  imports: [
    LogsModule.forRoot({
      apiUrl: 'http://localhost:3001/logs',
      projectName: 'meu-backend',
      ambient: 'development',
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplicar middleware de logs para todas as rotas
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
```

## Exemplo 5: Usando LogContext

```typescript
// src/request/request.service.ts
import { Injectable } from '@nestjs/common';
import { LogClient, LogContext } from '@evertrips/report-logs-client';

@Injectable()
export class RequestService {
  constructor(
    private readonly logClient: LogClient,
    private readonly logContext: LogContext,
  ) {}

  async processRequest(data: any) {
    const requestId = this.logContext.getRequestId();

    this.logClient.info('Processando requisição', {
      requestId,
      data,
    });

    // Processar dados...

    this.logClient.info('Requisição processada', {
      requestId,
      status: 'success',
    });
  }
}
```

## Exemplo 6: Com Tratamento de Erros

```typescript
// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { LogClient } from '@evertrips/report-logs-client';

@Injectable()
export class EmailService {
  constructor(private readonly logClient: LogClient) {}

  async sendEmail(to: string, subject: string, body: string) {
    try {
      this.logClient.info('Enviando email', {
        to,
        subject,
        timestamp: new Date(),
      });

      // Validação
      if (!to.includes('@')) {
        throw new Error('Email inválido');
      }

      // Simular envio
      await new Promise((resolve) => setTimeout(resolve, 100));

      this.logClient.info('Email enviado com sucesso', {
        to,
        subject,
      });

      return { success: true, to, subject };
    } catch (error) {
      this.logClient.error('Falha ao enviar email', {
        to,
        subject,
        errorMessage: error.message,
        errorCode: error.code,
        stack: error.stack,
      });

      throw error;
    }
  }

  async sendBulkEmails(recipients: string[]) {
    this.logClient.info('Iniciando envio em massa', {
      count: recipients.length,
    });

    const results = [];

    for (const email of recipients) {
      try {
        await this.sendEmail(email, 'Notificação', 'Conteúdo');
        results.push({ email, status: 'success' });
      } catch (error) {
        this.logClient.warn('Falha em email da lista', {
          email,
          reason: error.message,
        });
        results.push({ email, status: 'failed', reason: error.message });
      }
    }

    this.logClient.info('Envio em massa concluído', {
      total: recipients.length,
      success: results.filter((r) => r.status === 'success').length,
      failed: results.filter((r) => r.status === 'failed').length,
    });

    return results;
  }
}
```

## Exemplo 7: Database Operations

```typescript
// src/database/database.service.ts
import { Injectable } from '@nestjs/common';
import { LogClient } from '@evertrips/report-logs-client';

@Injectable()
export class DatabaseService {
  constructor(private readonly logClient: LogClient) {}

  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    const startTime = Date.now();

    try {
      this.logClient.debug('Executando query', {
        sql: sql.substring(0, 100),
        paramsCount: params.length,
      });

      // Simular query
      const result = [];
      await new Promise((resolve) => setTimeout(resolve, 50));

      const responseTime = Date.now() - startTime;

      this.logClient.debug('Query executada', {
        responseTime,
        resultCount: result.length,
      });

      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;

      this.logClient.error('Erro ao executar query', {
        sql: sql.substring(0, 100),
        errorMessage: error.message,
        responseTime,
      });

      throw error;
    }
  }

  async insert(table: string, data: any) {
    try {
      this.logClient.info('Inserindo registro', {
        table,
        dataKeys: Object.keys(data),
      });

      // Simular insert
      const id = 1;

      this.logClient.info('Registro inserido', {
        table,
        id,
      });

      return id;
    } catch (error) {
      this.logClient.error('Erro ao inserir', {
        table,
        error: error.message,
      });

      throw error;
    }
  }
}
```

## Exemplo 8: Com Variáveis de Ambiente

```typescript
// .env
LOGS_API_URL=http://localhost:3001/logs
LOGS_PROJECT_NAME=meu-projeto-backend
LOGS_AMBIENT=development
LOGS_TIMEOUT=5000
LOGS_RETRY_ATTEMPTS=3
LOGS_RETRY_DELAY=1000
```

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LogsModule } from '@evertrips/report-logs-client';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LogsModule.forRoot({
      apiUrl: process.env.LOGS_API_URL,
      projectName: process.env.LOGS_PROJECT_NAME,
      ambient: process.env.LOGS_AMBIENT as any,
    }),
  ],
})
export class AppModule {}
```

## Exemplo 9: Em um Serviço de Autenticação

```typescript
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LogClient } from '@evertrips/report-logs-client';

@Injectable()
export class AuthService {
  constructor(private readonly logClient: LogClient) {}

  async login(email: string, password: string) {
    try {
      this.logClient.info('Tentativa de login', {
        email,
        timestamp: new Date(),
      });

      // Validar credenciais
      if (password !== 'correct-password') {
        this.logClient.warn('Falha de autenticação', {
          email,
          reason: 'credenciais-invalidas',
        });
        throw new UnauthorizedException('Credenciais inválidas');
      }

      // Gerar token
      const token = 'jwt-token-exemplo';

      this.logClient.info('Login bem-sucedido', {
        email,
        tokenLength: token.length,
      });

      return { token, user: { email } };
    } catch (error) {
      this.logClient.error('Erro no login', {
        email,
        error: error.message,
      });
      throw error;
    }
  }
}
```

## Exemplo 10: Com Timing de Performance

```typescript
// src/performance/performance.service.ts
import { Injectable } from '@nestjs/common';
import { LogClient } from '@evertrips/report-logs-client';

@Injectable()
export class PerformanceService {
  constructor(private readonly logClient: LogClient) {}

  async trackOperation(
    operationName: string,
    operation: () => Promise<any>,
  ) {
    const startTime = Date.now();

    try {
      this.logClient.debug('Iniciando operação', { operationName });

      const result = await operation();

      const duration = Date.now() - startTime;

      this.logClient.info('Operação concluída', {
        operationName,
        duration,
        durationCategory: duration > 1000 ? 'slow' : 'normal',
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.logClient.error('Operação falhou', {
        operationName,
        duration,
        error: error.message,
      });

      throw error;
    }
  }
}
```

## Log Levels

| Level | Uso | Exemplo |
|-------|-----|---------|
| **DEBUG** | Informações de debug detalhadas | Valores de variáveis, entrada de métodos |
| **INFO** | Informações gerais e marcos importantes | Usuário criado, email enviado |
| **WARN** | Situações fora do normal mas não críticas | Falha de retry, recurso não encontrado |
| **ERROR** | Erros críticos que precisam atenção | Exceções não tratadas, falhas de DB |

## Dicas

1. **Sempre log em try/catch**: Use info/debug no happy path, warn/error no catch
2. **Inclua contexto**: Sempre forneça metadata útil para debugging
3. **Não logue senhas**: Nunca registre dados sensíveis
4. **Use request ID**: Correlacione logs com requisições HTTP
5. **Monitore performance**: Registre tempos de operações críticas
