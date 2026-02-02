import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogClient } from './log-client';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);
  private logClient: LogClient;

  constructor() {
    this.logClient = new LogClient();
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body } = req;
    const startTime = Date.now();

    // Capturar referências para usar dentro do closure
    const logClient = this.logClient;
    const logger = this.logger;

    // Capturar resposta original
    const originalSend = res.send;

    res.send = function (data) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;

      // Log de request/response
      if (statusCode >= 400) {
        // Log de erro
        logClient
          .error(
            `${method} ${originalUrl} - Status ${statusCode}`,
            undefined,
            'HttpRequest',
          )
          .catch((err) => logger.error('Erro ao registrar log:', err));
      } else if (statusCode >= 300) {
        // Log de aviso
        logClient
          .warn(
            `${method} ${originalUrl} - Status ${statusCode}`,
            'HttpRequest',
          )
          .catch((err) => logger.error('Erro ao registrar log:', err));
      }

      // Log de sucesso (opcional - pode gerar muitos logs)
      // logClient.info(`${method} ${originalUrl} - ${statusCode} (${duration}ms)`);

      return originalSend.call(this, data);
    };

    next();
  }
}
