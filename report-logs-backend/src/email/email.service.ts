import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { configuration } from '../config/configuration';

interface EmailOptions {
  subject: string;
  html: string;
  to?: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      host: configuration.email.host,
      port: configuration.email.port,
      secure: configuration.email.port === 465,
      auth: {
        user: configuration.email.user,
        pass: configuration.email.pass,
      },
    });
  }

  async sendErrorAlert(error: any, details?: string): Promise<boolean> {
    try {
      const errorMessage = error?.message || JSON.stringify(error);
      const stack = error?.stack || '';

      const html = `
        <h2>⚠️ Alerta de Erro no Sistema de Logs</h2>
        <hr>
        <h3>Erro:</h3>
        <p><strong>${errorMessage}</strong></p>
        ${details ? `<h3>Detalhes:</h3><p>${details}</p>` : ''}
        <h3>Stack Trace:</h3>
        <pre>${stack}</pre>
        <hr>
        <p><em>Timestamp: ${new Date().toISOString()}</em></p>
      `;

      const mailOptions = {
        from: configuration.email.from,
        to: configuration.email.to,
        subject: `🚨 Erro Detectado no Report de Logs`,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado:', info.response);
      return true;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return false;
    }
  }

  async sendLogReport(logs: any[], count: number): Promise<boolean> {
    try {
      const logsHtml = logs
        .map(
          (log) => `
        <tr>
          <td>${log.id}</td>
          <td>${log.level || 'INFO'}</td>
          <td>${log.message}</td>
          <td>${log.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()}</td>
        </tr>
      `,
        )
        .join('');

      const html = `
        <h2>📊 Relatório de Logs</h2>
        <hr>
        <p>Total de logs registrados: <strong>${count}</strong></p>
        <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
          <thead style="background-color: #f0f0f0;">
            <tr>
              <th>ID</th>
              <th>Nível</th>
              <th>Mensagem</th>
              <th>Data/Hora</th>
            </tr>
          </thead>
          <tbody>
            ${logsHtml}
          </tbody>
        </table>
        <hr>
        <p><em>Gerado em: ${new Date().toISOString()}</em></p>
      `;

      const mailOptions = {
        from: configuration.email.from,
        to: configuration.email.to,
        subject: `📊 Relatório de Logs - ${new Date().toLocaleDateString('pt-BR')}`,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Relatório enviado:', info.response);
      return true;
    } catch (error) {
      console.error('Erro ao enviar relatório:', error);
      return false;
    }
  }

  async sendCleanupNotification(
    deletedCount: number,
    retentionDays: number,
  ): Promise<boolean> {
    try {
      const html = `
        <h2>🧹 Limpeza de Logs Automática</h2>
        <hr>
        <p>A limpeza automática de logs foi executada com sucesso!</p>
        <ul>
          <li><strong>Logs deletados:</strong> ${deletedCount}</li>
          <li><strong>Período de retenção:</strong> ${retentionDays} dias</li>
          <li><strong>Data/Hora:</strong> ${new Date().toISOString()}</li>
        </ul>
        <hr>
        <p><em>Esta é uma notificação automática do sistema.</em></p>
      `;

      const mailOptions = {
        from: configuration.email.from,
        to: configuration.email.to,
        subject: `🧹 Limpeza Automática - ${deletedCount} logs removidos`,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Notificação de limpeza enviada:', info.response);
      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação de limpeza:', error);
      return false;
    }
  }
}
