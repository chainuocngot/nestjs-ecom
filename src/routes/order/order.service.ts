import { Injectable } from '@nestjs/common';
import { CreateOrderBodyType, GetListOrderQueryType } from 'src/routes/order/order.model';
import { OrderRepository } from 'src/routes/order/order.repository';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  list(params: GetListOrderQueryType & { userId: number }) {
    return this.orderRepository.list(params);
  }

  create(userId: number, body: CreateOrderBodyType) {
    return this.orderRepository.create(userId, body);
  }
}
