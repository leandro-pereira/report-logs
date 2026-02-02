import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar Validação Global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas
      forbidNonWhitelisted: true, // Lança erro se houver propriedades extra
      transform: true, // Transforma automaticamente tipos
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const formatErrors = errors.map((error) => ({
          field: error.property,
          errors: Object.values(error.constraints || {}),
        }));

        return new BadRequestException({
          success: false,
          message: 'Validation failed',
          errors: formatErrors,
        });
      },
    }),
  );

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Report Logs API')
    .setDescription(
      'API para reporting e gerenciamento de logs com autenticação via API Key',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'key:secret',
        description: 'API Key no formato: key:secret',
      },
      'bearer',
    )
    .addTag('Logs', 'Gerenciar e reportar logs')
    .addTag('API Keys', 'Criar e gerenciar chaves de autenticação')
    .setExternalDoc(
      'Guia de Uso API Keys',
      '/api-keys-guide.md',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestHeaders: true,
    },
    customCss: `
      .topbar { display: none; }
      .info { margin: 20px 0; }
      .scheme-container { background: #f5f5f5; padding: 10px; border-radius: 4px; }
    `,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`\n🚀 Servidor iniciado em http://localhost:${port}`);
  console.log(`📚 Swagger disponível em http://localhost:${port}/api/docs\n`);
}

bootstrap();
