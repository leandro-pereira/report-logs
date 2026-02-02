import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { LogClient } from './log-client';
import { LogContext } from './log-context';

/**
 * Interceptor global que:
 * 1. Gera um requestId único no início de cada requisição
 * 2. Armazena no contexto para uso durante a execução
 * 3. Coleta todos os logs da requisição
 * 4. Envia tudo para o serviço de logs ao final
 */
@Injectable()
export class LogsInterceptor implements NestInterceptor {
  constructor(
    private readonly logClient: LogClient,
    private readonly logContext: LogContext,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Gerar requestId único para essa requisição
    const requestId = uuidv4();
    
    // Inicializar contexto
    this.logContext.initializeContext(requestId);

    // Anexar requestId ao request para fácil acesso
    (request as any).requestId = requestId;
    (request as any).logContext = this.logContext;

    // Registrar início da requisição
    const startTime = Date.now();
    const method = request.method;
    const path = request.path;
    const userAgent = request.get('user-agent');

    // Log de início
    this.logContext.debug(`Iniciando ${method} ${path}`, 'HttpRequest', {
      userAgent,
    });

    return next.handle().pipe(
      tap((data) => {
        // Requisição bem-sucedida
        this.handleSuccessResponse(
          request,
          response,
          requestId,
          startTime,
          data,
        );
      }),
      catchError((error) => {
        // Erro durante a requisição
        this.handleErrorResponse(
          request,
          response,
          requestId,
          startTime,
          error,
        );
        throw error;
      }),
    );
  }

  /**
   * Manipula respostas bem-sucedidas
   */
  private async handleSuccessResponse(
    request: any,
    response: any,
    requestId: string,
    startTime: number,
    data: any,
  ) {
    const duration = Date.now() - startTime;
    const statusCode = response.statusCode || 200;
    const method = request.method;
    const path = request.path;
    const userAgent = request.get('user-agent');
    const authenticatedBy = request.user?.id || request.get('authorization');

    // Registrar conclusão
    this.logContext.debug(`Finalizando ${method} ${path} com status ${statusCode}`, 'HttpRequest', {
      duration,
      statusCode,
    });

    // Coletar todos os logs registrados durante a execução
    const collectedLogs = this.logContext.getLogs();

    // Enviar para o serviço de logs
    await this.logClient.sendLog({
      requestId,
      message: `${method} ${path} - ${statusCode}`,
      level: statusCode >= 400 ? 'WARN' : 'INFO',
      context: 'HttpRequest',
      path,
      method,
      statusCode,
      userAgent,
      authenticatedBy,
      responseTime: duration,
      metadata: {
        request: {
          body: request.body,
          query: request.query,
          params: request.params,
        },
        collectedLogs,
      },
    });

    this.logContext.clear();
  }

  /**
   * Manipula erros durante a requisição
   */
  private async handleErrorResponse(
    request: any,
    response: any,
    requestId: string,
    startTime: number,
    error: any,
  ) {
    const duration = Date.now() - startTime;
    const statusCode = error.status || response.statusCode || 500;
    const method = request.method;
    const path = request.path;
    const userAgent = request.get('user-agent');
    const authenticatedBy = request.user?.id || request.get('authorization');
    const errorMessage = error.message || 'Erro desconhecido';

    // Registrar erro
    this.logContext.error(`Erro em ${method} ${path}`, 'HttpRequest', {
      error: errorMessage,
      statusCode,
    });

    // Coletar todos os logs registrados durante a execução
    const collectedLogs = this.logContext.getLogs();

    // Enviar para o serviço de logs
    await this.logClient.sendLog({
      requestId,
      message: `${method} ${path} - ${statusCode} - ${errorMessage}`,
      level: 'ERROR',
      context: 'HttpRequest',
      path,
      method,
      statusCode,
      userAgent,
      authenticatedBy,
      responseTime: duration,
      errorMessage,
      stack: error.stack,
      metadata: {
        request: {
          body: request.body,
          query: request.query,
          params: request.params,
        },
        error: {
          message: error.message,
          name: error.name,
          statusCode: error.status,
        },
        collectedLogs,
      },
    });

    this.logContext.clear();
  }
}
