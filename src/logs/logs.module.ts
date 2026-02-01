import { Module, DynamicModule, Global } from '@nestjs/common';
import { LogClient } from '../common/log-client';

export interface LogsModuleConfig {
  apiUrl: string;
  projectName: string;
  ambient: 'development' | 'staging' | 'production';
}

@Global()
@Module({})
export class LogsModule {
  static register(config: LogsModuleConfig): DynamicModule {
    const logClientProvider = {
      provide: LogClient,
      useValue: new LogClient(config.apiUrl, config.projectName),
    };

    return {
      module: LogsModule,
      global: true,
      providers: [logClientProvider],
      exports: [LogClient],
    };
  }
}
