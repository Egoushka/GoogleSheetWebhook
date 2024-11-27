import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { CacheModule } from '@nestjs/cache-manager';
import { Analytics } from './models/analytics.model';
import { Row } from './models/row.model';
import { AnalyticsController } from './controllers/analytics.controller';
import { RowController } from './controllers/row.controller';
import { WebhookController } from './controllers/webhook.controller';
import { AnalyticsService } from './services/analytics.service';
import { EmailService } from './services/email.service';
import { RowService } from './services/row.service';

dotenv.config();

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Row, Analytics],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    }),
  ],
  controllers: [AnalyticsController, RowController, WebhookController],
  providers: [AnalyticsService, EmailService, RowService],
})
export class AppModule {}
