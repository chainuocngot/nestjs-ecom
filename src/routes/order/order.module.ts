import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from 'src/routes/order/order.repository';
import { BullModule } from '@nestjs/bullmq';
import { PAYMENT_QUEUE_NAME } from 'src/shared/constants/app.constant';
import { OrderProducer } from 'src/routes/order/order.producer';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderProducer],
  imports: [
    BullModule.registerQueue({
      name: PAYMENT_QUEUE_NAME,
    }),
  ],
})
export class OrderModule {}
