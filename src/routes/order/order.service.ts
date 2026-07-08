import { Injectable } from '@nestjs/common';
import { OrderNotFoundException } from 'src/routes/order/order.error';
import { CreateOrderBodyType, GetListOrderQueryType } from 'src/routes/order/order.model';
import { OrderProducer } from 'src/routes/order/order.producer';
import { OrderRepository } from 'src/routes/order/order.repository';
import { isNotFoundPrismaError } from 'src/shared/utils';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderProducer: OrderProducer,
  ) {}

  list(params: GetListOrderQueryType & { userId: number }) {
    return this.orderRepository.list(params);
  }

  async create(userId: number, body: CreateOrderBodyType) {
    const { orders, payment } = await this.orderRepository.create(userId, body);

    await this.orderProducer.addCancelPaymentJob(payment.id);

    return {
      data: orders,
    };
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
