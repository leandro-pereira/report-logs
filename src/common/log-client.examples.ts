/**
 * EXEMPLOS DE COMO USAR O CLIENT DE LOGS
 * 
 * Este arquivo mostra como integrar a API de logs
 * em qualquer serviço Node.js
 */

import {
  LogClient,
  initializeLogClient,
  reportError,
  reportInfo,
  reportWarn,
  reportDebug,
} from '../common/log-client';

// ============================================
// EXEMPLO 1: Inicializar o cliente
// ============================================

// Option A: Usar função helper
initializeLogClient('http://localhost:3000');

// Option B: Criar instância
const logClient = new LogClient('http://localhost:3000');

// ============================================
// EXEMPLO 2: Reportar logs simples
// ============================================

async function exemplo_logs_simples() {
  // Info
  await reportInfo('Aplicação iniciada', 'AppService');

  // Warn
  await reportWarn('Taxa de erro elevada', 'HealthCheck');

  // Error
  await reportError('Banco de dados offline', undefined, 'DatabaseService');

  // Debug
  await reportDebug(
    'Consultando usuários',
    'UserService',
    { userId: 123, action: 'GET' },
  );
}

// ============================================
// EXEMPLO 3: Reportar erros capturados
// ============================================

async function exemplo_captura_erros() {
  try {
    // Seu código que pode falhar
    throw new Error('Conexão recusada');
  } catch (error) {
    // Reportar erro automaticamente
    await reportError(
      'Falha ao conectar no banco de dados',
      error as Error,
      'DatabaseService',
    );
  }
}

// ============================================
// EXEMPLO 4: Usar em um controlador NestJS
// ============================================

import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private logClient: LogClient) {}

  @Get()
  async getUsers() {
    try {
      await this.logClient.info('Recuperando usuários', 'UsersController');

      // Seu código
      const users = []; // simulado

      return users;
    } catch (error) {
      await this.logClient.error(
        'Erro ao recuperar usuários',
        error as Error,
        'UsersController',
      );
      throw error;
    }
  }

  @Post()
  async createUser(@Body() userData: any) {
    try {
      await this.logClient.debug(
        'Criando novo usuário',
        'UsersController',
        userData,
      );

      // Seu código
      const user = { id: 1, ...userData };

      await this.logClient.info(
        `Usuário criado: ${user.id}`,
        'UsersController',
      );

      return user;
    } catch (error) {
      await this.logClient.error(
        'Erro ao criar usuário',
        error as Error,
        'UsersController',
      );
      throw error;
    }
  }
}

// ============================================
// EXEMPLO 5: Usar em um serviço
// ============================================

import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  constructor(private logClient: LogClient) {}

  async processPayment(orderId: string, amount: number) {
    try {
      await this.logClient.info(
        `Processando pagamento: Pedido ${orderId}, Valor R$ ${amount}`,
        'PaymentService',
      );

      // Simular validação
      if (amount <= 0) {
        throw new Error('Valor inválido');
      }

      // Simular processamento
      const transactionId = Math.random().toString(36);

      await this.logClient.info(
        `Pagamento processado: ${transactionId}`,
        'PaymentService',
      );

      return { success: true, transactionId };
    } catch (error) {
      await this.logClient.error(
        `Erro ao processar pagamento do pedido ${orderId}`,
        error as Error,
        'PaymentService',
      );

      throw error;
    }
  }
}

// ============================================
// EXEMPLO 6: Usar com async/await em função main
// ============================================

async function main() {
  try {
    await reportInfo('Aplicação iniciando...', 'main');

    // Seu código aqui
    console.log('Executando operações...');

    await reportInfo('Aplicação iniciada com sucesso', 'main');
  } catch (error) {
    await reportError('Erro fatal na inicialização', error as Error, 'main');
    process.exit(1);
  }
}

// ============================================
// EXEMPLO 7: Integração com tratamento de exceções
// ============================================

export class GlobalExceptionHandler {
  constructor(private logClient: LogClient) {}

  async handleException(error: Error, context: string) {
    // Log de erro detalhado
    await this.logClient.log({
      message: error.message,
      level: 'ERROR',
      context,
      metadata: {
        errorName: error.name,
        errorType: error.constructor.name,
      },
      stack: error.stack,
    });
  }
}

// ============================================
// EXEMPLO 8: Monitorar performance
// ============================================

export async function monitoredOperation<T>(
  operationName: string,
  operation: () => Promise<T>,
  context: string,
): Promise<T> {
  const logClient = new LogClient();
  const startTime = Date.now();

  try {
    await logClient.info(
      `Iniciando: ${operationName}`,
      context,
    );

    const result = await operation();

    const duration = Date.now() - startTime;
    await logClient.info(
      `Concluído: ${operationName} (${duration}ms)`,
      context,
    );

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    await logClient.error(
      `Erro em: ${operationName} (${duration}ms)`,
      error as Error,
      context,
    );
    throw error;
  }
}

// Uso do monitoredOperation:
async function exemplo_monitored() {
  const users = await monitoredOperation(
    'Recuperar usuários do banco',
    async () => {
      // Simulação
      return [{ id: 1, name: 'João' }];
    },
    'UserRepository',
  );

  return users;
}

// ============================================
// EXEMPLO 9: Batch de logs
// ============================================

async function exemplo_batch_logs() {
  const logClient = new LogClient();

  // Enviar múltiplos logs
  const promises = [
    logClient.info('Operação 1', 'BatchService'),
    logClient.info('Operação 2', 'BatchService'),
    logClient.info('Operação 3', 'BatchService'),
    logClient.error('Erro na operação 4', undefined, 'BatchService'),
  ];

  await Promise.all(promises);
}

// ============================================
// EXEMPLO 10: Consultar e processar logs
// ============================================

async function exemplo_consultar_logs() {
  const logClient = new LogClient();

  try {
    // Obter últimos 50 logs
    const logs = await logClient.getLogs(50);
    console.log('Total de logs:', logs.length);

    // Filtrar erros
    const errors = logs.filter((log) => log.level === 'ERROR');
    console.log('Total de erros:', errors.length);

    // Processar um log específico
    if (logs.length > 0) {
      const firstLog = await logClient.getLog(logs[0].id);
      console.log('Primeiro log:', firstLog);
    }
  } catch (error) {
    console.error('Erro ao consultar logs:', error);
  }
}

// ============================================
// RESUMO DOS MÉTODOS DISPONÍVEIS
// ============================================

/*
LogClient fornece os seguintes métodos:

1. logClient.log(payload)
   - Enviar log customizado
   - Parâmetros: message, level, context, metadata, stack

2. logClient.error(message, error?, context?)
   - Enviar log de erro
   - Captura stack trace automaticamente

3. logClient.warn(message, context?)
   - Enviar log de aviso

4. logClient.info(message, context?)
   - Enviar log informativo

5. logClient.debug(message, context?, metadata?)
   - Enviar log de debug

6. logClient.getLogs(limit?)
   - Recuperar logs (padrão: 100)

7. logClient.getLog(id)
   - Obter log específico

8. logClient.cleanup(daysOld?)
   - Limpar logs antigos (padrão: 30 dias)

9. logClient.sendReport()
   - Enviar relatório por email

HELPERS GLOBAIS:
- reportLog(payload)
- reportError(message, error?, context?)
- reportWarn(message, context?)
- reportInfo(message, context?)
- reportDebug(message, context?, metadata?)

Todos retornam Promise com o ID do log criado.
*/
