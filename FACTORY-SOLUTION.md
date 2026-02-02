# Solução Alternativa com Factory

## Problema
O LogContext não está sendo inicializado corretamente quando o módulo é importado.

## Solução com Factory

**Remova** a importação do `LogsModule` e use a factory diretamente:

```typescript
import { Module } from '@nestjs/common';
import { LogsProviderFactory } from '@evertrips/report-logs-client';
// outros imports...

@Module({
  imports: [
    // REMOVA: LogsModule.forRoot({...}),
    // outros módulos...
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    ImagesService, 
    RecaptchaService,
    // ADICIONE OS PROVIDERS VIA FACTORY:
    ...LogsProviderFactory.createProviders({
      projectName: process.env.LOGS_PROJECT_NAME || 'nicetrips-api',
      apiUrl: process.env.LOGS_API_URL || 'http://localhost:3001/logs',
      ambient: (process.env.LOGS_AMBIENT as 'development' | 'staging' | 'production') || 'development',
      retryAttempts: 3,
      timeout: 5000,
      retryDelay: 1000,
    }),
  ],
})
export class AppModule {}
```

## Alternativa - Providers Básicos (sem interceptor automático)

Se ainda não funcionar, use os providers básicos e registre o interceptor separadamente:

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LogsProviderFactory, LogsInterceptor } from '@evertrips/report-logs-client';

@Module({
  imports: [
    // outros módulos...
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    ImagesService, 
    RecaptchaService,
    
    // Providers básicos (sem interceptor)
    ...LogsProviderFactory.createBasicProviders({
      projectName: process.env.LOGS_PROJECT_NAME || 'nicetrips-api',
      apiUrl: process.env.LOGS_API_URL || 'http://localhost:3001/logs',
      ambient: (process.env.LOGS_AMBIENT as 'development' | 'staging' | 'production') || 'development',
    }),
    
    // Interceptor separado
    {
      provide: APP_INTERCEPTOR,
      useClass: LogsInterceptor,
    },
  ],
})
export class AppModule {}
```

## Por que usar Factory?

1. **Controle direto**: Você controla exatamente como os providers são criados
2. **Compatibilidade**: Funciona melhor com NestJS v9
3. **Debugging**: Mais fácil de debugar problemas de injeção
4. **Flexibilidade**: Você pode customizar a configuração facilmente