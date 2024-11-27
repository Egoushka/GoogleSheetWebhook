import { Body, Controller, Post } from '@nestjs/common';
import { EventsGateway } from 'src/events/events.gateway';
import { EmailService } from 'src/services/email.service';
import { RowService } from 'src/services/row.service';

@Controller('webhook')
export class WebhookController {
  private rowCount = 0;

  constructor(
    private readonly rowService: RowService,
    private readonly emailService: EmailService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Post()
  async handleWebhook(@Body() data: any) {
    const rowId = data.rowId;

    if (await this.rowService.exists(rowId)) {
      const updatedRow = await this.rowService.updateRow(rowId, data.content);

      console.log(`Updated row with ID: ${rowId}`);

      return updatedRow;
    }

    const newRow = await this.rowService.createRow(data.content);

    console.log(`Created new row with ID: ${rowId}`);

    if (this.rowCount % 10 === 0) {
      //const usersWithAccess = await this.getUsersWithAccess(); // Get users with access to the file

      await this.emailService.sendEmailNotification(
        '',
        'New Rows Added to the File',
      );
    }

    return newRow;
  }
}
