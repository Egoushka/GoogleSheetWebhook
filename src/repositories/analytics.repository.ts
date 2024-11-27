import { DataSource, Repository } from 'typeorm';
import { Analytics } from '../models/analytics.model';

export class AnalyticsRepository extends Repository<Analytics> {
  constructor(private dataSource: DataSource) {
    super(Analytics, dataSource.createEntityManager());
  }
  async getById(id: number) {
    return this.findOne({ where: { id } });
  }

  public async logEvent(eventType: string, description: string) {
    const analytics = this.create({
      eventType,
      description,
    });
    await this.save(analytics);
  }
}
