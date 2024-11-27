import { Body, Controller, Post } from '@nestjs/common';
import { EventsGateway } from 'src/events/events.gateway';
import { RowService } from 'src/services/row.service';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly rowService: RowService,
    private readonly eventsGateway: EventsGateway, // Inject the WebSocket gateway
  ) {}

  @Post()
  async handleWebhook(@Body() data: any) {
    const newRow = await this.rowService.createRow(data.content);

    this.eventsGateway.sendMessage(newRow);

    return newRow;
  }
}
