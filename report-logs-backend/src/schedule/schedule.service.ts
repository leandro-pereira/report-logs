import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LogsService } from '../logs/logs.service';
import { configuration } from '../config/configuration';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(private readonly logsService: LogsService) {}

  /**
   * Executa limpeza de logs diariamente às 2 da manhã
   * Remove logs com mais de 1 mês no banco
   */
  @Cron('0 2 * * *')
  async handleDailyCleanup() {
    this.logger.log('Iniciando limpeza automática de logs...');
    try {
      const retentionDays = configuration.logRetention.days;
      await this.logsService.cleanupOldLogs(retentionDays);
      this.logger.log(
        `Limpeza concluída. Logs com mais de ${retentionDays} dias foram removidos.`,
      );
    } catch (error) {
      this.logger.error('Erro durante a limpeza automática:', error);
    }
  }

  /**
   * Envia relatório diário de logs às 8 da manhã
   */
  @Cron('0 8 * * *')
  async handleDailyReport() {
    this.logger.log('Enviando relatório diário de logs...');
    try {
      await this.logsService.sendDailyReport();
      this.logger.log('Relatório diário enviado com sucesso');
    } catch (error) {
      this.logger.error('Erro ao enviar relatório diário:', error);
    }
  }

  /**
   * Limpeza a cada 6 horas como backup
   */
  @Cron(CronExpression.EVERY_6_HOURS)
  async handleFrequentCleanup() {
    this.logger.debug('Executando limpeza de verificação a cada 6 horas...');
    // Isso pode ser desabilitado se a limpeza diária for suficiente
    // await this.logsService.cleanupOldLogs(configuration.logRetention.days);
  }
}
