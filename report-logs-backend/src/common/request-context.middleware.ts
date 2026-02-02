import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para capturar informações da requisição
 * Adiciona ao objeto request: path, method, userAgent, statusCode
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request & { requestContext?: any }, res: Response, next: NextFunction) {
    // Capturar informações da requisição
    req.requestContext = {
      path: req.path,
      method: req.method,
      userAgent: req.get('user-agent') || 'Unknown',
    };

    // Capturar o statusCode quando a resposta for enviada
    const originalSend = res.send;
    res.send = function (data: any) {
      req.requestContext.statusCode = res.statusCode;
      return originalSend.call(this, data);
    };

    next();
  }
}
