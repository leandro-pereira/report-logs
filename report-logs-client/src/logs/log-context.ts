import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuidv4 } from 'uuid';

export interface RequestLog {
  timestamp: number;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  context?: string;
  data?: Record<string, any>;
}

export interface LogContextData {
  requestId: string;
  logs: RequestLog[];
}

/**
 * Serviço para gerenciar contexto de logs por request
 * Usa AsyncLocalStorage para manter contexto isolado por requisição
 */
@Injectable()
export class LogContext {
  private storage = new AsyncLocalStorage<LogContextData>();

  /**
   * Inicializa o contexto para uma nova requisição
   */
  initializeContext(requestId?: string): string {
    const id = requestId || uuidv4();
    
    this.storage.enterWith({
      requestId: id,
      logs: [],
    });

    return id;
  }

  /**
   * Obtém o requestId da requisição atual
   */
  getRequestId(): string | undefined {
    return this.storage.getStore()?.requestId;
  }

  /**
   * Registra um log no contexto da requisição
   */
  addLog(level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', message: string, context?: string, data?: Record<string, any>): void {
    const store = this.storage.getStore();
    if (!store) {
      console.warn('LogContext não inicializado');
      return;
    }

    store.logs.push({
      timestamp: Date.now(),
      level,
      message,
      context,
      data,
    });
  }

  /**
   * Registra um log de INFO
   */
  info(message: string, context?: string, data?: Record<string, any>): void {
    this.addLog('INFO', message, context, data);
  }

  /**
   * Registra um log de WARN
   */
  warn(message: string, context?: string, data?: Record<string, any>): void {
    this.addLog('WARN', message, context, data);
  }

  /**
   * Registra um log de ERROR
   */
  error(message: string, context?: string, data?: Record<string, any>): void {
    this.addLog('ERROR', message, context, data);
  }

  /**
   * Registra um log de DEBUG
   */
  debug(message: string, context?: string, data?: Record<string, any>): void {
    this.addLog('DEBUG', message, context, data);
  }

  /**
   * Obtém todos os logs registrados na requisição atual
   */
  getLogs(): RequestLog[] {
    const store = this.storage.getStore();
    return store?.logs || [];
  }

  /**
   * Limpa o contexto (geralmente chamado ao final da requisição)
   */
  clear(): void {
    const store = this.storage.getStore();
    if (store) {
      store.logs = [];
    }
  }

  /**
   * Executa uma função dentro do contexto de uma requisição
   */
  run<T>(requestId: string, fn: () => T): T {
    return this.storage.run({ requestId, logs: [] }, fn);
  }
}
