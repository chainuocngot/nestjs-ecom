import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from 'src/routes/order/order.repository';
import { BullModule } from '@nestjs/bullmq';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  imports: [
    BullModule.registerQueue({
      name: 'payment',
    }),
  ],
})
export class OrderModule {}
