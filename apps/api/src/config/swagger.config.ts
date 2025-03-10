import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('API Documentation')
  .setDescription('Documentação da API')
  .setVersion('1.0')
  .addBearerAuth()
  .setBasePath('api')
  .build();
