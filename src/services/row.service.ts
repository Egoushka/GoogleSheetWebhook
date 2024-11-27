import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';
import { Row } from 'src/models/row.model';

@Injectable()
export class RowService {
  constructor(
    @InjectRepository(Row)
    private readonly rowRepository: Repository<Row>,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache, // Updated Cache Type
  ) {}

  async createRow(content: string): Promise<Row> {
    const row = this.rowRepository.create({ content });
    const savedRow = await this.rowRepository.save(row);

    this.triggerWebhook(savedRow);
    this.triggerWebSocket(savedRow);

    return savedRow;
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

  async updateRow(id: number, content: string): Promise<Row> {
    const row = await this.getRowById(id);
    row.content = content;

    const updatedRow = await this.rowRepository.save(row);

    await this.cacheManager.del(`row_${id}`);
    await this.cacheManager.del('all_rows');

    this.triggerWebhook(updatedRow);
    this.triggerWebSocket(updatedRow);

    return updatedRow;
  }

  async deleteRow(id: number): Promise<void> {
    const row = await this.getRowById(id);
    await this.rowRepository.remove(row);

    await this.cacheManager.del(`row_${id}`);
    await this.cacheManager.del('all_rows');
  }

  private triggerWebhook(row: Row) {
    console.log(`Webhook triggered for row: ${JSON.stringify(row)}`);
  }

  private triggerWebSocket(row: Row) {
    console.log(`WebSocket triggered for row: ${JSON.stringify(row)}`);
  }
}
