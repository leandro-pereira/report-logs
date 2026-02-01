import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { EmailModule } from './email/email.module';
import { LogsModule } from './logs/logs.module';
import { AppScheduleModule } from './schedule/schedule.module';
import { ApiKeyModule } from './api-key/api-key.module';
import { ApiKeyMiddleware } from './api-key/api-key.middleware';
import { RequestContextMiddleware } from './common/request-context.middleware';

@Module({
  imports: [FirebaseModule, EmailModule, LogsModule, AppScheduleModule, ApiKeyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplicar middleware de contexto de requisição globalmente
    consumer
      .apply(RequestContextMiddleware)
      .forRoutes('*');

    // Aplicar middleware de API Key apenas na rota /logs
    consumer
      .apply(ApiKeyMiddleware)
      .forRoutes('/logs');
  }
}
