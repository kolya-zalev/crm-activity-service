import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  ACTIVITY_QUEUE,
  bindQueueToEvents,
  HttpToRpcExceptionFilter,
} from '@crm/shared';
import { ActivityServiceModule } from './activity-service.module';

const rabbitUrl = process.env.RABBIT_URL ?? 'amqp://localhost:5672';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ActivityServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitUrl],
        queue: ACTIVITY_QUEUE,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  // Подписка шаблонами topic: все события лидов и заметок
  await bindQueueToEvents({
    url: rabbitUrl,
    queue: ACTIVITY_QUEUE,
    events: ['lead.*', 'note.*'],
  });

  app.useGlobalFilters(new HttpToRpcExceptionFilter());
  await app.listen();
  console.log('Activity service working');
}

bootstrap();
