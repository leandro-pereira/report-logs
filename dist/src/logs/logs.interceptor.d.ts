import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LogClient } from './log-client';
import { LogContext } from './log-context';
/**
 * Interceptor global que:
 * 1. Gera um requestId único no início de cada requisição
 * 2. Armazena no contexto para uso durante a execução
 * 3. Coleta todos os logs da requisição
 * 4. Envia tudo para o serviço de logs ao final
 */
export declare class LogsInterceptor implements NestInterceptor {
    private logClient;
    private logContext;
    constructor(logClient: LogClient, logContext: LogContext);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    /**
     * Manipula respostas bem-sucedidas
     */
    private handleSuccessResponse;
    /**
     * Manipula erros durante a requisição
     */
    private handleErrorResponse;
}
//# sourceMappingURL=logs.interceptor.d.ts.map