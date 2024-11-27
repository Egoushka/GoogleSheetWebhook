import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { RowService } from './row.service';  // Adjust import path
import { Row } from './models/row.model';  // Adjust import path
import { Analytics } from './models/analytics.model';  // Adjust import path
import { AnalyticsService } from './analytics.service';
import { EventsGateway } from './events.gateway';
import { RowController } from './row.controller';  // Adjust import path
import { WebhookController } from './webhook.controller';  // Adjust import path

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
    TypeOrmModule.forFeature([Row, Analytics]),
  ],
  controllers: [RowController, WebhookController],
  providers: [RowService, AnalyticsService, EventsGateway],
})
export class AppModule {}
