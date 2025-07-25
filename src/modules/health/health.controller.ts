import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { Public } from '../../common/decorators';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  checkHealth() {
    return this.healthService.getHealth();
  }

  @Public()
  @Get('status')
  getStatus() {
    return this.healthService.getStatus();
  }
}