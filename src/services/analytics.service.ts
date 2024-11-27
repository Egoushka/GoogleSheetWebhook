import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { EmailService } from './email.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly analyticsRepository: AnalyticsRepository,
    private readonly emailService: EmailService,
  ) {}

  async logEvent(eventType: string, description: string): Promise<void> {
    await this.analyticsRepository.logEvent(eventType, description);
  }

  async getAllEvents(): Promise<any[]> {
    return this.analyticsRepository.find();
  }

  async getRowCount(): Promise<number> {
    return this.analyticsRepository.getRowCount();
  }
}
