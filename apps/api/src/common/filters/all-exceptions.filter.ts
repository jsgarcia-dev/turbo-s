import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionsHandler');

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      method: request.method,
      message:
        exception instanceof HttpException
          ? exception.message
          : 'Internal server error',
      body: request.body,
      params: request.params,
      query: request.query,
      stack:
        process.env.NODE_ENV === 'development'
          ? exception instanceof Error
            ? exception.stack
            : null
          : undefined,
    };

    this.logger.error(responseBody);
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
