import { Injectable } from '@nestjs/common';
import { OrderNotFoundException } from 'src/routes/order/order.error';
import { CreateOrderBodyType, GetListOrderQueryType } from 'src/routes/order/order.model';
import { OrderRepository } from 'src/routes/order/order.repository';
import { isNotFoundPrismaError } from 'src/shared/utils';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  list(params: GetListOrderQueryType & { userId: number }) {
    return this.orderRepository.list(params);
  }

  create(userId: number, body: CreateOrderBodyType) {
    return this.orderRepository.create(userId, body);
  }

  async findById(userId: number, orderId: number) {
    try {
      return await this.orderRepository.findById(userId, orderId);
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw OrderNotFoundException;
      }

      throw error;
    }
  }

  async cancelOrder(userId: number, orderId: number) {
    try {
      return await this.orderRepository.cancelOrder(userId, orderId);
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw OrderNotFoundException;
      }

      throw error;
    }
  }
}
