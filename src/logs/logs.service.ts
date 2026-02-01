import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { EmailService } from '../email/email.service';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogsService {
  private readonly logger = new Logger(LogsService.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly emailService: EmailService,
  ) {}

  async createLog(createLogDto: CreateLogDto, apiKey?: any, requestContext?: any): Promise<string> {
    try {
      const logData = {
        ...createLogDto,
        level: createLogDto.level || 'INFO',
        timestamp: new Date().toISOString(),
      };

      // Remover campos undefined (Firestore não aceita undefined)
      Object.keys(logData).forEach(key => {
        if (logData[key] === undefined) {
          delete logData[key];
        }
      });

      // Adicionar informações da requisição capturadas pelo middleware
      if (requestContext) {
        if (requestContext.path && !logData['path']) {
          logData['path'] = requestContext.path;
        }
        if (requestContext.method && !logData['method']) {
          logData['method'] = requestContext.method;
        }
        if (requestContext.userAgent && !logData['userAgent']) {
          logData['userAgent'] = requestContext.userAgent;
        }
        if (requestContext.statusCode && !logData['statusCode']) {
          logData['statusCode'] = requestContext.statusCode;
        }
      }

      // Adicionar informação da API Key se fornecida
      if (apiKey) {
        logData['apiKeyId'] = apiKey.id;
        logData['apiKeyName'] = apiKey.name;
      }

      const logId = await this.firebaseService.saveLog(logData);

      // Enviar alerta por email se for erro
      if (createLogDto.level === 'ERROR') {
        // await this.emailService.sendErrorAlert(
        //   new Error(createLogDto.message),
        //   `Context: ${createLogDto.context || 'N/A'}\nMetadata: ${JSON.stringify(createLogDto.metadata || {})}\nAPI Key: ${apiKey?.name || 'N/A'}`,
        // );
      }

      this.logger.log(`Log criado com sucesso: ${logId}`);
      return logId;
    } catch (error) {
      this.logger.error('Erro ao criar log:', error);
      // await this.emailService.sendErrorAlert(
      //   error,
      //   `Falha ao criar log: ${createLogDto.message}`,
      // );
      throw error;
    }
  }

  async getAllLogs(limit = 100): Promise<any[]> {
    try {
      return await this.firebaseService.getLogs(limit);
    } catch (error) {
      this.logger.error('Erro ao recuperar logs:', error);
      throw error;
    }
  }

  async getLogById(logId: string): Promise<any> {
    try {
      return await this.firebaseService.getLogById(logId);
    } catch (error) {
      this.logger.error(`Erro ao recuperar log ${logId}:`, error);
      throw error;
    }
  }

  async cleanupOldLogs(daysOld: number): Promise<number> {
    try {
      const deletedCount = await this.firebaseService.deleteOldLogs(daysOld);
      this.logger.log(`${deletedCount} logs antigos foram deletados`);

      // Enviar notificação
      // if (deletedCount > 0) {
      //   await this.emailService.sendCleanupNotification(deletedCount, daysOld);
      // }

      return deletedCount;
    } catch (error) {
      this.logger.error('Erro ao limpar logs antigos:', error);
      // await this.emailService.sendErrorAlert(
      //   error,
      //   'Falha na limpeza automática de logs',
      // );
      throw error;
    }
  }

  async sendDailyReport(): Promise<boolean> {
    try {
      const logs = await this.firebaseService.getLogs(50);
      // await this.emailService.sendLogReport(logs, logs.length);
      this.logger.log('Relatório diário enviado com sucesso');
      return true;
    } catch (error) {
      this.logger.error('Erro ao enviar relatório diário:', error);
      // await this.emailService.sendErrorAlert(error, 'Falha ao enviar relatório');
      return false;
    }
  }
}
