import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { ApiResponse } from '../types';
  
  @Injectable()
  export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
      const request = context.switchToHttp().getRequest();
      
      return next.handle().pipe(
        map(data => ({
          success: true,
          message: 'Success',
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
        })),
      );
    }
  }