import { Injectable } from '@nestjs/common';
import { LogClient } from './log-client';

/**
 * Exemplo de como usar LogClient em seus serviços
 * 
 * O LogClient está disponível globalmente em todos os serviços NestJS
 * através da injeção de dependência.
 */

@Injectable()
export class ExampleLoggingService {
  constructor(private readonly logClient: LogClient) {}

  /**
   * Exemplo 1: Log simples de informação
   */
  async exampleSimpleLog() {
    await this.logClient.info(
      'Aplicação iniciada com sucesso',
      'ExampleService',
    );
  }

  /**
   * Exemplo 2: Log com metadados
   */
  async exampleLogWithMetadata(userId: string, email: string) {
    await this.logClient.info(
      'Usuário fez login',
      'AuthService',
      {
        userId,
        email,
        timestamp: new Date().toISOString(),
      },
    );
  }

  /**
   * Exemplo 3: Log de erro com stack trace
   */
  async exampleErrorLog(orderId: string) {
    try {
      // Simular erro
      throw new Error('Falha ao processar pagamento');
    } catch (error) {
      await this.logClient.error(
        `Erro ao processar pagamento do pedido ${orderId}`,
        error,
        'PaymentService',
        {
          orderId,
          timestamp: new Date().toISOString(),
        },
      );
    }
  }

  /**
   * Exemplo 4: Log de aviso
   */
  async exampleWarnLog(remainingBalance: number) {
    if (remainingBalance < 100) {
      await this.logClient.warn(
        'Saldo baixo detectado',
        'AccountService',
        {
          remainingBalance,
          threshold: 100,
        },
      );
    }
  }

  /**
   * Exemplo 5: Log de debug
   */
  async exampleDebugLog(data: any) {
    await this.logClient.debug(
      'Dados processados',
      'ProcessingService',
      {
        dataSize: JSON.stringify(data).length,
        keys: Object.keys(data),
      },
    );
  }

  /**
   * Exemplo 6: Usando requestId para rastrear uma requisição
   */
  async exampleWithRequestId() {
    // Gerar novo requestId
    const requestId = this.logClient.generateRequestId();

    // Log 1 - Início
    await this.logClient.sendLog({
      requestId,
      message: 'Iniciando processamento',
      level: 'INFO',
      context: 'OrderProcessing',
      metadata: { orderId: '12345' },
    });

    // Simulação de processamento
    // ... seu código aqui ...

    // Log 2 - Sucesso
    await this.logClient.sendLog({
      requestId,
      message: 'Processamento concluído',
      level: 'INFO',
      context: 'OrderProcessing',
      metadata: { orderId: '12345', duration: '2.5s' },
    });
  }

  /**
   * Exemplo 7: Log de processo com múltiplos passos
   */
  async exampleMultiStepProcess(tripId: string) {
    const requestId = this.logClient.generateRequestId();

    try {
      // Passo 1
      await this.logClient.info(
        'Iniciando validação de viagem',
        'TripService',
        { requestId, tripId, step: 1 },
      );

      // Passo 2
      await this.logClient.info(
        'Validando disponibilidade',
        'TripService',
        { requestId, tripId, step: 2 },
      );

      // Passo 3
      await this.logClient.info(
        'Confirmando reserva',
        'TripService',
        { requestId, tripId, step: 3 },
      );

      // Conclusão
      await this.logClient.info(
        'Viagem processada com sucesso',
        'TripService',
        { requestId, tripId, status: 'completed' },
      );
    } catch (error) {
      await this.logClient.error(
        'Erro ao processar viagem',
        error,
        'TripService',
        { requestId, tripId, status: 'failed' },
      );
    }
  }
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
