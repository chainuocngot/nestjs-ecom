import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { GetListOrderQueryType } from 'src/routes/order/order.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list({ limit, page, status, userId }: GetListOrderQueryType & { userId: number }) {
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      userId,
      status,
    };

    const $countTotalOrder = this.prismaService.order.count({
      where,
    });
    const $getOrders = this.prismaService.order.findMany({
      where,
      include: {
        items: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const [total, records] = await Promise.all([$countTotalOrder, $getOrders]);

    return {
      total,
      records,
    };
  }
}
