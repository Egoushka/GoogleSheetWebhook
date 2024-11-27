import { DataSource, Repository } from 'typeorm';
import { Row } from '../models/row.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RowRepository extends Repository<Row> {
  constructor(private dataSource: DataSource) {
    super(Row, dataSource.createEntityManager());
  }
  async getById(id: number) {
    return this.findOne({ where: { id } });
  }
}
