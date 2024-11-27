import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async logEvent(eventType: string, description: string): Promise<void> {
    await this.analyticsRepository.logEvent(eventType, description);
  }

  async getAllEvents(): Promise<any[]> {
    return this.analyticsRepository.find();
  }
}
