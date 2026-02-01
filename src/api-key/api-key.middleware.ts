import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiKeyService } from './api-key.service';

export const ApiKeyAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.apiKey;
  },
);

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private apiKeyService: ApiKeyService) {}

  use(req: Request & { apiKey?: any }, res: Response, next: NextFunction) {
    try {
      // Extrair chave dos headers
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException('Chave API não fornecida');
      }

      // Formato: "Bearer key:secret" ou "key:secret"
      const credentials = authHeader.replace('Bearer ', '');
      const [apiKey, apiSecret] = credentials.split(':');

      if (!apiKey || !apiSecret) {
        throw new UnauthorizedException(
          'Formato inválido. Use: Authorization: Bearer key:secret',
        );
      }

      // Validar chave
      const validatedKey = this.apiKeyService.validateApiKey(apiKey, apiSecret);

      // Anexar à request
      req.apiKey = validatedKey;

      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Falha na autenticação da chave API');
    }
  }
}
