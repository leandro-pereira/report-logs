import { Injectable } from '@nestjs/common';
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
 * Versão simplificada compatível com NestJS v9
 */
@Injectable()
export class LogContext {
  private contextData: LogContextData = {
    requestId: '',
    logs: [],
  };

  /**
   * Define qual request este contexto está vinculado
   */
  setRequest(request: any): void {
    // Armazenar contexto diretamente no request object
    if (!request.__logContext) {
      request.__logContext = {
        requestId: uuidv4(),
        logs: [],
      };
    }
    this.contextData = request.__logContext;
  }

  /**
   * Inicializa o contexto para uma nova requisição
   */
  initializeContext(requestId?: string): string {
    const id = requestId || uuidv4();
    
    this.contextData = {
      requestId: id,
      logs: [],
    };

    return id;
  }

  /**
   * Obtém o requestId da requisição atual
   */
  getRequestId(): string | undefined {
    return this.contextData?.requestId;
  }

  /**
   * Registra um log no contexto da requisição
   */
  addLog(level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', message: string, context?: string, data?: Record<string, any>): void {
    if (!this.contextData) {
      console.warn('LogContext não inicializado');
      return;
    }

    this.contextData.logs.push({
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
    return this.contextData?.logs || [];
  }

  /**
   * Limpa o contexto (geralmente chamado ao final da requisição)
   */
  clear(): void {
    if (this.contextData) {
      this.contextData.logs = [];
    }
  }

  /**
   * Executa uma função dentro do contexto de uma requisição
   * @deprecated Use request-scoped injection instead
   */
  run<T>(requestId: string, fn: () => T): T {
    // Para compatibilidade, mas não é necessário com request scope
    return fn();
  }
}
