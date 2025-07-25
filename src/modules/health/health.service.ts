import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(private configService: ConfigService) {}

  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: this.configService.get('NODE_ENV'),
      version: '1.0.0',
    };
  }

  getStatus() {
    return {
      database: 'connected',
      redis: 'connected', // if using Redis
      api: 'running',
      uptime: process.uptime(),
    };
  }
}