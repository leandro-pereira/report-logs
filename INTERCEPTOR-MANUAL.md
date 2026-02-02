# Como Registrar o Interceptor Manualmente

## Problema
O interceptor não está funcionando quando registrado automaticamente pela biblioteca em projetos externos.

## Solução
Registre o interceptor manualmente no seu `AppModule`:

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LogsModule, LogsInterceptor } from '@evertrips/report-logs-client';
// outros imports...

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
  controllers: [AppController],
  providers: [
    AppService, 
    ImagesService, 
    RecaptchaService,
    // ADICIONE ESTE PROVIDER PARA REGISTRAR O INTERCEPTOR:
    {
      provide: APP_INTERCEPTOR,
      useClass: LogsInterceptor,
    },
  ],
})
export class AppModule {}
```

## Por que isso é necessário?

1. **Compatibilidade com NestJS v9**: A injeção de dependência funciona diferente entre v9 e v11
2. **Bibliotecas externas**: O contexto de injeção pode ser perdido quando o código está em `node_modules`
3. **Controle manual**: Você tem mais controle sobre quando e como o interceptor é registrado

## Como funciona agora:

1. `LogsModule` fornece `LogClient`, `LogContext` e `LogsInterceptor` 
2. Você registra manualmente o `LogsInterceptor` como `APP_INTERCEPTOR`
3. O NestJS fará a injeção de dependência correta no contexto do seu projeto
4. O interceptor funcionará corretamente com acesso ao `LogContext` e `LogClient`