import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    if (typeof message === 'object' && message.hasOwnProperty('message')) {
      message = message['message'];
    }

    response.status(status).json({
      success: false,
      error: {
        message,
        statusCode: status,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
