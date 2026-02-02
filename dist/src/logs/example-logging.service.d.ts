import { LogClient } from './log-client';
/**
 * Exemplo de como usar LogClient em seus serviços
 *
 * O LogClient está disponível globalmente em todos os serviços NestJS
 * através da injeção de dependência.
 */
export declare class ExampleLoggingService {
    private readonly logClient;
    constructor(logClient: LogClient);
    /**
     * Exemplo 1: Log simples de informação
     */
    exampleSimpleLog(): Promise<void>;
    /**
     * Exemplo 2: Log com metadados
     */
    exampleLogWithMetadata(userId: string, email: string): Promise<void>;
    /**
     * Exemplo 3: Log de erro com stack trace
     */
    exampleErrorLog(orderId: string): Promise<void>;
    /**
     * Exemplo 4: Log de aviso
     */
    exampleWarnLog(remainingBalance: number): Promise<void>;
    /**
     * Exemplo 5: Log de debug
     */
    exampleDebugLog(data: any): Promise<void>;
    /**
     * Exemplo 6: Usando requestId para rastrear uma requisição
     */
    exampleWithRequestId(): Promise<void>;
    /**
     * Exemplo 7: Log de processo com múltiplos passos
     */
    exampleMultiStepProcess(tripId: string): Promise<void>;
}
/**
 * PADRÕES RECOMENDADOS:
 *
 * 1. SEMPRE use context para identificar o serviço/módulo
 * 2. SEMPRE use metadata para adicionar contexto útil
 * 3. Use requestId para rastrear requisições multipassos
 * 4. Log de erro SEMPRE deve incluir o objeto error
 * 5. Não envie dados sensíveis (senhas, tokens, etc)
 *
 * EXEMPLO DE USO EM UM CONTROLLER:
 *
 *   @Post('login')
 *   async login(@Body() dto: LoginDto) {
 *     const requestId = this.logClient.generateRequestId();
 *     try {
 *       const result = await this.authService.login(dto.email, dto.password);
 *       await this.logClient.info(
 *         `Login bem-sucedido para ${dto.email}`,
 *         'AuthController',
 *         { requestId, email: dto.email }
 *       );
 *       return result;
 *     } catch (error) {
 *       await this.logClient.error(
 *         `Falha no login para ${dto.email}`,
 *         error,
 *         'AuthController',
 *         { requestId, email: dto.email }
 *       );
 *       throw error;
 *     }
 *   }
 */
//# sourceMappingURL=example-logging.service.d.ts.map