import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from 'src/routes/order/order.repository';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
