import { Controller, Get, Param, Patch, Post, Body } from '@nestjs/common';
import { RowService } from 'src/services/row.service';

@Controller('rows')
export class RowController {
  constructor(private readonly rowService: RowService) {}

  @Get()
  async getAllRows() {
    return this.rowService.getAllRows();
  }

  @Get(':id')
  async getRowById(@Param('id') id: number) {
    return this.rowService.getRowById(id);
  }

  @Post()
  async createRow(@Body('content') content: string) {
    return this.rowService.createRow(content);
  }

  @Patch(':id')
  async updateRow(@Param('id') id: number, @Body('content') content: string) {
    return this.rowService.updateRow(id, content);
  }
}
