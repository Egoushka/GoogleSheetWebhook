import { AnalyticsService } from 'src/services/analytics.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';
import { Row } from 'src/models/row.model';
import { EventsGateway } from 'src/events/events.gateway';
import { EmailService } from './email.service';
import { RowRepository } from 'src/repositories/row.repository';

@Injectable()
export class RowService {
  constructor(
    @InjectRepository(Row)
    private readonly rowRepository: RowRepository,
    private readonly analyticsService: AnalyticsService,
    private readonly eventsGateway: EventsGateway,
    private readonly emailService: EmailService,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) {}

  async createRow(content: string): Promise<Row> {
    const row = this.rowRepository.create({ content });
    const savedRow = await this.rowRepository.save(row);

    await this.analyticsService.logEvent(
      'create',
      `New row created with content: ${content}`,
    );

    // Emit WebSocket message
    this.eventsGateway.sendMessage(savedRow);

    return savedRow;
  }

  async updateRow(id: number, content: string): Promise<Row> {
    const row = await this.rowRepository.findOne({ where: { id } });

    if (!row) {
      throw new Error(`Row with ID ${id} not found`);
    }

    row.content = content;
    const updatedRow = await this.rowRepository.save(row);

    // Log event in analytics
    await this.analyticsService.logEvent(
      'update',
      `Row with ID ${id} updated to content: ${content}`,
    );

    // Emit WebSocket message
    this.eventsGateway.sendMessage(updatedRow);

    return updatedRow;
  }

  async getAllRows(): Promise<Row[]> {
    const cacheKey = 'all_rows';

    const cachedRows = await this.cacheManager.get<Row[]>(cacheKey);
    if (cachedRows) {
      return cachedRows;
    }

    const rows = await this.rowRepository.find();
    await this.cacheManager.set(cacheKey, rows, 300);

    return rows;
  }

  async getRowById(id: number): Promise<Row> {
    const cacheKey = `row_${id}`;

    const cachedRow = await this.cacheManager.get<Row>(cacheKey);
    if (cachedRow) {
      return cachedRow;
    }

    const row = await this.rowRepository.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException(`Row with ID ${id} not found.`);
    }

    await this.cacheManager.set(cacheKey, row, 300);

    return row;
  }

  private async notifyBatch(): Promise<void> {
    const totalRows = await this.rowRepository.count();

    if (totalRows % 10 === 0) {
      const emails = ['ihorstetsky618@gmail.com']; // Add all file access emails
      const message = `There are now ${totalRows} rows in the sheet.`;

      for (const email of emails) {
        await this.emailService.sendEmailNotification(email, message);
      }
    }
  }
}
