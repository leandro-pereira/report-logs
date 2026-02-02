import { DynamicModule, Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LogClient } from './log-client';
import { LogContext } from './log-context';
import { LogsInterceptor } from './logs.interceptor';
import { LogsModuleConfig } from './types';
import { Logger } from './logger';

@Global()
@Module({
  providers: [
    LogContext,
    {
      provide: LogClient,
      useFactory: async () => {
        const projectName = process.env.LOGS_PROJECT_NAME || 'NiceTripsAPI';
        const logsApiUrl = process.env.LOGS_API_URL || 'http://localhost:3000';
        const ambient = (process.env.LOGS_AMBIENT || 'development') as 'development' | 'staging' | 'production';

        const logClient = new LogClient(
          logsApiUrl,
          projectName,
          ambient as 'development' | 'staging' | 'production',
        );

        Logger.info(`✅ LogClient inicializado para o projeto "${projectName}"`);

        return logClient;
      },
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (logClient: LogClient, logContext: LogContext) => {
        return new LogsInterceptor(logClient, logContext);
      },
      inject: [LogClient, LogContext],
    },
  ],
  exports: [LogClient, LogContext],
})
export class LogsModule {
  /**
   * Configura o módulo de logs com parâmetros customizados
   *
   * @param config Configuração do módulo (apiUrl, projectName, ambient)
   * @returns DynamicModule
   *
   * @example
   * ```typescript
   * import { LogsModule } from '@evertrips/report-logs-client';
   *
   * @Module({
   *   imports: [
   *     LogsModule.forRoot({
   *       apiUrl: 'http://localhost:3001/logs',
   *       projectName: 'meu-projeto',
   *       ambient: 'development',
   *     }),
   *   ],
   * })
   * export class AppModule {}
   * ```
   */
  static forRoot(config: LogsModuleConfig): DynamicModule {
    return {
      module: LogsModule,
      global: true,
      providers: [
        LogContext,
        {
          provide: LogClient,
          useFactory: async () => {
            const projectName = config.projectName || process.env.LOGS_PROJECT_NAME || 'DefaultProject';
            const logsApiUrl = config.apiUrl || process.env.LOGS_API_URL || 'http://localhost:3000/logs';
            const ambient = (config.ambient || process.env.LOGS_AMBIENT || 'development') as 'development' | 'staging' | 'production';

            const logClient = new LogClient(
              logsApiUrl,
              projectName,
              ambient,
            );

            Logger.info(`✅ LogClient inicializado`, {
              projectName,
              apiUrl: logsApiUrl,
              ambient,
            });

            return logClient;
          },
        },
        {
          provide: APP_INTERCEPTOR,
          useFactory: (logClient: LogClient, logContext: LogContext) => {
            return new LogsInterceptor(logClient, logContext);
          },
          inject: [LogClient, LogContext],
        },
      ],
      exports: [LogClient, LogContext],
    };
  }
}
