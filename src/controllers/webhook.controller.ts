import { Body, Controller, Post } from '@nestjs/common';
import { RowService } from 'src/services/row.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly rowService: RowService) {}

  @Post()
  async handleWebhook(@Body() data: any) {
    const newRow = await this.rowService.createRow(data.content);
    // Надіслати повідомлення через WebSocket
    // Додати подію в аналітику
    return newRow;
  }
}
