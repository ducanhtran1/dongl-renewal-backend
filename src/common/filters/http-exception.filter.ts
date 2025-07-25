import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { ApiResponse } from '../types';
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);
  
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      let status: number;
      let message: string;
      let error: any;
  
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        
        if (typeof exceptionResponse === 'string') {
          message = exceptionResponse;
        } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
          message = (exceptionResponse as any).message || exception.message;
          error = (exceptionResponse as any).error;
        } else {
          message = exception.message;
        }
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Internal server error';
        error = exception;
      }
  
      // Log error details
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${message}`,
        exception instanceof Error ? exception.stack : exception,
      );
  
      const errorResponse: ApiResponse = {
        success: false,
        message,
        error: process.env.NODE_ENV === 'production' ? undefined : error,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
  
      response.status(status).json(errorResponse);
    }
  }