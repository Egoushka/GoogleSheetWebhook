import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from 'src/services/analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  async getAllEvents() {
    return this.analyticsService.getAllEvents();
  }
}
