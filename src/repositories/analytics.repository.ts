import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Analytics } from '../models/analytics.model';

@Injectable()
export class AnalyticsRepository {
  constructor(
    @InjectRepository(Analytics)
    private readonly analyticsRepository: Repository<Analytics>,
  ) {}

  async logEvent(eventType: string, description: string): Promise<Analytics> {
    const newEvent = this.analyticsRepository.create({
      eventType,
      description,
    });
    return this.analyticsRepository.save(newEvent);
  }

  async find(): Promise<Analytics[]> {
    return this.analyticsRepository.find();
  }

  async getRowCount(): Promise<number> {
    const analytics = await this.analyticsRepository.findOne({
      where: { id: 1 },
    });
    return analytics ? analytics.rowCount : 0;
  }
}
