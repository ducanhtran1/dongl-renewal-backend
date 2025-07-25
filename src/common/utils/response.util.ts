import { ApiResponse, PaginatedResponse } from '../types';

export class ResponseUtil {
  static success<T>(data: T, message = 'Success'): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      path: '', // Will be set by interceptor
    };
  }

  static error(message: string, error?: any): ApiResponse {
    return {
      success: false,
      message,
      error: process.env.NODE_ENV === 'production' ? undefined : error,
      timestamp: new Date().toISOString(),
      path: '', // Will be set by filter
    };
  }

  static paginated<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResponse<T> {
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}