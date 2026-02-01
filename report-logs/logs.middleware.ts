import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogClient } from './log-client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LogsMiddleware implements NestMiddleware {
  constructor(private readonly logClient: LogClient) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Gera um novo requestId para cada requisição
    const requestId = uuidv4();
    this.logClient.generateRequestId();

    // Anexa ao request para uso posterior
    (req as any).requestId = requestId;
    (req as any).logClient = this.logClient;

    // Guardar referência de this para usar no callback
    const logClient = this.logClient;

    // Registrar início da requisição
    const startTime = Date.now();

    // Interceptar a resposta para registrar status
    const originalSend = res.send;
    res.send = function (data: any) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;

      // Capturar informações de autenticação
      const authenticatedBy = (req as any).user?.id || req.get('authorization') || undefined;

      // Extrair mensagem de erro se houver
      let errorMessage: string | undefined;
      if (statusCode >= 400) {
        try {
          const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
          errorMessage = parsedData?.message || parsedData?.error || undefined;
        } catch {
          errorMessage = undefined;
        }
      }

      // Log da requisição
      const logMessage = `${req.method} ${req.path} - ${statusCode}`;

      // Registrar com o nível apropriado
      if (statusCode >= 500) {
        logClient.error(logMessage, undefined, 'HttpRequest', (req as any).body, undefined, {
          requestId,
          method: req.method,
          path: req.path,
          statusCode,
          userAgent: req.get('user-agent'),
          authenticatedBy,
          responseTime: duration,
          errorMessage,
        }).catch();
      } else if (statusCode >= 400) {
        logClient.warn(logMessage, 'HttpRequest', (req as any).body, {
          requestId,
          method: req.method,
          path: req.path,
          statusCode,
          userAgent: req.get('user-agent'),
          authenticatedBy,
          responseTime: duration,
          errorMessage,
        }).catch();
      } else {
        logClient.info(logMessage, 'HttpRequest', (req as any).body, {
          requestId,
          method: req.method,
          path: req.path,
          statusCode,
          userAgent: req.get('user-agent'),
          authenticatedBy,
          responseTime: duration,
        }).catch();
      }

      return originalSend.call(this, data);
    };

    next();
  }
}
