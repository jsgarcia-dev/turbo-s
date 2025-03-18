import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { appConfig } from './config/app.config';
import { swaggerConfig } from './config/swagger.config';
import * as compression from 'compression';
import helmet from 'helmet';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixo global da API
  app.setGlobalPrefix(appConfig.apiPrefix);

  // Configuração do Swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(appConfig.swaggerPath, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'API Documentation',
    useGlobalPrefix: true, // Usar o prefixo global da API
  });

  // Middlewares de segurança
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: appConfig.corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Pipes globais
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Interceptors globais
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Filtro de exceções global
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Inicialização do servidor
  await app.listen(appConfig.port);

  console.log(`Aplicação rodando em http://localhost:${appConfig.port}`);
  console.log(
    `Documentação disponível em: http://localhost:${appConfig.port}/${appConfig.apiPrefix}/${appConfig.swaggerPath}`,
  );
}

bootstrap();
