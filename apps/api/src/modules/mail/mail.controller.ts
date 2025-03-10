import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';

@ApiTags('Email')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @ApiOperation({ summary: 'Envia um email' })
  @ApiResponse({
    status: 200,
    description: 'O email foi enviado com sucesso',
  })
  async sendMail(@Body() sendMailDto: SendMailDto) {
    return this.mailService.sendMail(sendMailDto);
  }
}
