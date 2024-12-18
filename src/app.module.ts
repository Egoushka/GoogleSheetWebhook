import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { RowController } from './controllers/row.controller';
import { WebhookController } from './controllers/webhook.controller';
import { EventsGateway } from './events/events.gateway';
import { Analytics } from './models/analytics.model';
import { Row } from './models/row.model';
import { AnalyticsService } from './services/analytics.service';
import { RowService } from './services/row.service';
import { AnalyticsRepository } from './repositories/analytics.repository';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Row, Analytics],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: true,
      logger: 'advanced-console',
    }),
    TypeOrmModule.forFeature([Row, Analytics]),
  ],
  controllers: [RowController, WebhookController],
  providers: [RowService, AnalyticsService, EventsGateway, AnalyticsRepository],
})
export class AppModule {}
