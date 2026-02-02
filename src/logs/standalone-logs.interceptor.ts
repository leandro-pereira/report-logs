import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

interface RequestLog {
  timestamp: number;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  context?: string;
  data?: Record<string, any>;
}

interface LogContextData {
  requestId: string;
  logs: RequestLog[];
}

/**
 * Interceptor auto-suficiente que não depende de injeção de dependência
 * Funciona de forma independente mesmo sem LogsModule
 */
@Injectable()
export class StandaloneLogsInterceptor implements NestInterceptor {
  private static config: {
    apiUrl: string;
    projectName: string;
    ambient: 'development' | 'staging' | 'production';
  } | null = null;

  /**
   * Configura o interceptor estaticamente
   */
  static configure(config: {
    apiUrl: string;
    projectName: string;
    ambient: 'development' | 'staging' | 'production';
  }) {
    StandaloneLogsInterceptor.config = config;
    console.log(`✅ StandaloneLogsInterceptor configurado para ${config.projectName}`);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Gerar requestId único
    const requestId = uuidv4();
    const startTime = Date.now();

    // Inicializar contexto diretamente no request
    const logContext: LogContextData = {
      requestId,
      logs: [],
    };

    // Anexar ao request
    (request as any).requestId = requestId;
    (request as any).logContext = logContext;

    // Helper functions para logging
    const addLog = (level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', message: string, context?: string, data?: any) => {
      logContext.logs.push({
        timestamp: Date.now(),
        level,
        message,
        context,
        data,
      });
    };

    // Anexar helpers ao request
    (request as any).logInfo = (message: string, context?: string, data?: any) => addLog('INFO', message, context, data);
    (request as any).logWarn = (message: string, context?: string, data?: any) => addLog('WARN', message, context, data);
    (request as any).logError = (message: string, context?: string, data?: any) => addLog('ERROR', message, context, data);
    (request as any).logDebug = (message: string, context?: string, data?: any) => addLog('DEBUG', message, context, data);

    // Log inicial
    const method = request.method;
    const path = request.path;
    const userAgent = request.get('user-agent');
    
    addLog('DEBUG', `Iniciando ${method} ${path}`, 'HttpRequest', { userAgent });

    return next.handle().pipe(
      tap((data) => {
        this.handleSuccess(request, response, requestId, startTime, logContext);
      }),
      catchError((error) => {
        this.handleError(request, response, requestId, startTime, error, logContext);
        throw error;
      }),
    );
  }

  private async handleSuccess(
    request: any,
    response: any,
    requestId: string,
    startTime: number,
    logContext: LogContextData,
  ) {
    try {
      const duration = Date.now() - startTime;
      const statusCode = response.statusCode || 200;
      const method = request.method;
      const path = request.path;

      logContext.logs.push({
        timestamp: Date.now(),
        level: 'DEBUG',
        message: `Finalizando ${method} ${path} com status ${statusCode}`,
        context: 'HttpRequest',
        data: { duration, statusCode },
      });

      // Enviar logs se configurado
      if (StandaloneLogsInterceptor.config) {
        await this.sendLogs(requestId, method, path, statusCode, duration, request, logContext, null);
      }
    } catch (error) {
      console.error('❌ Erro ao processar logs de sucesso:', error);
    }
  }

  private async handleError(
    request: any,
    response: any,
    requestId: string,
    startTime: number,
    error: any,
    logContext: LogContextData,
  ) {
    try {
      const duration = Date.now() - startTime;
      const statusCode = error.status || response.statusCode || 500;
      const method = request.method;
      const path = request.path;
      const errorMessage = error.message || 'Erro desconhecido';

      logContext.logs.push({
        timestamp: Date.now(),
        level: 'ERROR',
        message: `Erro em ${method} ${path}`,
        context: 'HttpRequest',
        data: { error: errorMessage, statusCode },
      });

      // Enviar logs se configurado
      if (StandaloneLogsInterceptor.config) {
        await this.sendLogs(requestId, method, path, statusCode, duration, request, logContext, error);
      }
    } catch (loggingError) {
      console.error('❌ Erro ao processar logs de erro:', loggingError);
    }
  }

  private async sendLogs(
    requestId: string,
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    request: any,
    logContext: LogContextData,
    error: any = null,
  ) {
    try {
      const config = StandaloneLogsInterceptor.config!;
      const userAgent = request.get('user-agent');
      const authenticatedBy = request.user?.id || request.get('authorization');
      
      const logPayload = {
        requestId,
        message: error 
          ? `${method} ${path} - ${statusCode} - ${error.message}`
          : `${method} ${path} - ${statusCode}`,
        level: error ? 'ERROR' : (statusCode >= 400 ? 'WARN' : 'INFO'),
        context: 'HttpRequest',
        path,
        method,
        statusCode,
        userAgent,
        authenticatedBy,
        responseTime: duration,
        errorMessage: error?.message,
        stack: error?.stack,
        ambient: config.ambient,
        projectName: config.projectName,
        timestamp: new Date(),
        metadata: {
          request: {
            body: request.body,
            query: request.query,
            params: request.params,
          },
          collectedLogs: logContext.logs,
          ...(error && {
            error: {
              message: error.message,
              name: error.name,
              statusCode: error.status,
            }
          })
        },
      };

      // Enviar para API (usando fetch nativo do Node.js)
      await fetch(config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logPayload),
      }).catch(err => {
        console.warn('⚠️ Falha ao enviar logs:', err.message);
      });

    } catch (error) {
      console.warn('⚠️ Erro ao enviar logs:', error);
    }
  }
}