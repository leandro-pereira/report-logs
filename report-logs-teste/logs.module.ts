import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LogClient } from './log-client';
import { LogContext } from './log-context';
import { LogsInterceptor } from './logs.interceptor';

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

        console.log(`✅ LogClient inicializado para o projeto "${projectName}"`);

        return logClient;
      },
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogsInterceptor,
    },
  ],
  exports: [LogClient, LogContext],
})
export class LogsModule {}
