import { Provider, Scope } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LogClient } from './log-client';
import { LogContext } from './log-context';
import { LogsInterceptor } from './logs.interceptor';
import { LogsModuleConfig } from './types';
import { Logger } from './logger';

/**
 * Factory para criar providers do sistema de logs
 * Para ser usado diretamente no AppModule quando a injeção automática não funciona
 */
export class LogsProviderFactory {
  
  /**
   * Cria todos os providers necessários para o sistema de logs
   * Use isso no seu AppModule quando a importação do LogsModule não funcionar
   */
  static createProviders(config: LogsModuleConfig): Provider[] {
    const logClientProvider: Provider = {
      provide: LogClient,
      useFactory: () => {
        const logClient = new LogClient(
          config.apiUrl,
          config.projectName,
          config.ambient,
        );

        Logger.info(`✅ LogClient inicializado via Factory`, {
          projectName: config.projectName,
          apiUrl: config.apiUrl,
          ambient: config.ambient,
        });

        return logClient;
      },
    };

    const logContextProvider: Provider = {
      provide: LogContext,
      useClass: LogContext,
      scope: Scope.TRANSIENT, // Cria nova instância para cada injeção
    };

    const interceptorProvider: Provider = {
      provide: APP_INTERCEPTOR,
      useClass: LogsInterceptor,
      scope: Scope.TRANSIENT, // Importante para que cada request tenha seu próprio interceptor
    };

    return [logClientProvider, logContextProvider, interceptorProvider];
  }

  /**
   * Cria providers sem o interceptor automático
   * Use quando quiser registrar o interceptor manualmente
   */
  static createBasicProviders(config: LogsModuleConfig): Provider[] {
    const logClientProvider: Provider = {
      provide: LogClient,
      useFactory: () => {
        const logClient = new LogClient(
          config.apiUrl,
          config.projectName,
          config.ambient,
        );

        console.log(`✅ LogClient inicializado via BasicFactory - ${config.projectName}`);

        return logClient;
      },
    };

    const logContextProvider: Provider = {
      provide: LogContext,
      useClass: LogContext,
      scope: Scope.TRANSIENT, // Nova instância para cada injeção
    };

    return [logClientProvider, logContextProvider, LogsInterceptor];
  }
}