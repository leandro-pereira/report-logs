import { Module, DynamicModule, Global } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { EmailModule } from '../email/email.module';
import { LogClient } from '../common/log-client';

export interface LogsModuleConfig {
  apiUrl: string;
  projectName: string;
  ambient: 'development' | 'staging' | 'production';
}

@Global()
@Module({
  imports: [FirebaseModule, EmailModule],
  controllers: [LogsController],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {
  static forRoot(config: LogsModuleConfig): DynamicModule {
    const logClientProvider = {
      provide: LogClient,
      useValue: new LogClient(config.apiUrl, config.projectName),
    };

    return {
      module: LogsModule,
      global: true,
      imports: [FirebaseModule, EmailModule],
      controllers: [LogsController],
      providers: [LogsService, logClientProvider],
      exports: [LogsService, LogClient],
    };
  }
}
