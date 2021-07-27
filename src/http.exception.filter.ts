import {ExceptionFilter, Catch, ArgumentsHost, HttpException,} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | { error: string; statusCode: 401; message: string }
      | { error: string; statusCode: 400; message: string[] }; // class-validator 에서 데이터를 줄때 이런 셋이여서 타이핑을 추가함

    return response.status(status).json({
      success: false,
      code: status,
      data: err.message,
    });
  }
}