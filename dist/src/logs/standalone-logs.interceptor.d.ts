import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
/**
 * Interceptor auto-suficiente que não depende de injeção de dependência
 * Funciona de forma independente mesmo sem LogsModule
 */
export declare class StandaloneLogsInterceptor implements NestInterceptor {
    private static config;
    /**
     * Configura o interceptor estaticamente
     */
    static configure(config: {
        apiUrl: string;
        projectName: string;
        ambient: 'development' | 'staging' | 'production';
    }): void;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private handleSuccess;
    private handleError;
    private sendLogs;
}
//# sourceMappingURL=standalone-logs.interceptor.d.ts.map