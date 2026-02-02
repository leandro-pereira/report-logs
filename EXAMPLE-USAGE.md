# Exemplo de Uso Correto

## 1. Instalação

```bash
npm install @evertrips/report-logs-client
```

## 2. Configuração no App Module

```typescript
import { Module } from '@nestjs/common';
import { LogsModule } from '@evertrips/report-logs-client';

@Module({
  imports: [
    LogsModule.forRoot({
      projectName: process.env.LOGS_PROJECT_NAME || 'nicetrips-api',
      apiUrl: process.env.LOGS_API_URL || 'http://localhost:3001/logs',
      ambient: (process.env.LOGS_AMBIENT as 'development' | 'staging' | 'production') || 'development',
      retryAttempts: 3,
      timeout: 5000,
      retryDelay: 1000,
    }),
    // outros módulos...
  ],
  // resto da configuração...
})
export class AppModule {}
```

## 3. Usando em um Service

```typescript
import { Injectable } from '@nestjs/common';
import { LogContext, LogClient } from '@evertrips/report-logs-client';

@Injectable()
export class UsersService {
  constructor(
    private readonly logContext: LogContext,
    private readonly logClient: LogClient,
  ) {}

  async createUser(userData: any) {
    // Log durante a execução
    this.logContext.info('Iniciando criação de usuário', 'UsersService', {
      email: userData.email,
    });

    try {
      // Lógica de criação...
      const user = await this.userRepository.save(userData);
      
      this.logContext.info('Usuário criado com sucesso', 'UsersService', {
        userId: user.id,
      });

      return user;
    } catch (error) {
      this.logContext.error('Erro na criação do usuário', 'UsersService', {
        error: error.message,
        userData,
      });
      
      throw error;
    }
  }
}
```

## 4. Log Manual (quando necessário)

```typescript
import { Injectable } from '@nestjs/common';
import { LogClient } from '@evertrips/report-logs-client';

@Injectable()
export class PaymentService {
  constructor(private readonly logClient: LogClient) {}

  async processPayment(paymentData: any) {
    try {
      // Processamento...
      
      // Log manual importante
      await this.logClient.sendLog({
        requestId: 'manual-payment-' + Date.now(),
        message: 'Pagamento processado com sucesso',
        level: 'INFO',
        context: 'PaymentService',
        metadata: {
          amount: paymentData.amount,
          currency: paymentData.currency,
          paymentMethod: paymentData.method,
        },
      });
      
    } catch (error) {
      await this.logClient.sendLog({
        requestId: 'manual-payment-error-' + Date.now(),
        message: 'Erro no processamento do pagamento',
        level: 'ERROR',
        context: 'PaymentService',
        errorMessage: error.message,
        stack: error.stack,
        metadata: paymentData,
      });
      
      throw error;
    }
  }
}
```

## Principais Correções Feitas:

1. **LogContext agora é obrigatório**: Removida a injeção opcional que estava causando problemas
2. **Exports corrigidos**: Removido conflito entre interface e classe LogContext
3. **Interceptor melhorado**: Agora funciona corretamente com o contexto
4. **TypeScript compilando**: Todos os tipos estão corretos

A biblioteca agora deve funcionar corretamente quando instalada como dependência em outros projetos!