import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface SendMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendMail({ to, subject, text, html }: SendMailOptions) {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to,
        subject,
        text,
        html,
      });

      this.logger.log(`Email enviado: ${info.messageId}`);

      const previewURL = nodemailer.getTestMessageUrl(info);
      this.logger.log(`Preview URL: ${previewURL}`);

      return info;
    } catch (error) {
      this.logger.error('Erro ao enviar email:', error);
      throw error;
    }
  }
}
