import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import {
  NotFoundCartItemException,
  OutOfStockSKUException,
  ProductNotFoundException,
  SKUNotBelongToShopException,
} from 'src/routes/order/order.error';
import { CreateOrderBodyType, GetListOrderQueryType } from 'src/routes/order/order.model';
import { OrderStatus } from 'src/shared/constants/order.constant';
import { PaymentStatus } from 'src/shared/constants/payment.constant';
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

  async create(userId: number, body: CreateOrderBodyType) {
    const allBodyCartItemIds = body.map((item) => item.cartItemIds).flat();
    const cartItems = await this.prismaService.cartItem.findMany({
      where: {
        id: {
          in: allBodyCartItemIds,
        },
        userId,
      },
      include: {
        sku: {
          include: {
            product: {
              include: {
                productTranslations: true,
              },
            },
          },
        },
      },
    });

    if (allBodyCartItemIds.length !== cartItems.length) {
      throw NotFoundCartItemException;
    }

    const isOutOfStock = cartItems.some((item) => {
      return item.sku.stock < item.quantity;
    });

    if (isOutOfStock) {
      throw OutOfStockSKUException;
    }

    const isExistNotReadyProduct = cartItems.some(
      (item) =>
        item.sku.product.deletedAt !== null ||
        item.sku.product.publishedAt === null ||
        item.sku.product.publishedAt > new Date(),
    );

    if (isExistNotReadyProduct) {
      throw ProductNotFoundException;
    }

    const cartItemsMap = new Map<number, (typeof cartItems)[number]>();
    cartItems.forEach((item) => {
      cartItemsMap.set(item.id, item);
    });
    const isValidShop = body.every((item) => {
      const bodyCartItemIds = item.cartItemIds;
      return bodyCartItemIds.every((cartItemId) => {
        const cartItem = cartItemsMap.get(cartItemId)!;
        return item.shopId === cartItem.sku.createdById;
      });
    });
    if (!isValidShop) {
      throw SKUNotBelongToShopException;
    }

    const orders = await this.prismaService.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          status: PaymentStatus.PENDING,
        },
      });
      const $createOrders = Promise.all(
        //IMPORTANT: Ở đây sử dụng nhiều làm create thay vì createMany
        //VÌ createMany chỉ tạo được các field là scalar type (ở đây phải sử dụng create vì có field `items` và `products`)
        body.map((item) =>
          tx.order.create({
            data: {
              userId,
              status: OrderStatus.PENDING_PAYMENT,
              receiver: item.receiver,
              createdById: userId,
              shopId: item.shopId,
              paymentId: payment.id,
              items: {
                create: item.cartItemIds.map((cartItemId) => {
                  const cartItem = cartItemsMap.get(cartItemId)!;
                  return {
                    productName: cartItem.sku.product.name,
                    skuPrice: cartItem.sku.price,
                    image: cartItem.sku.image,
                    skuId: cartItem.sku.id,
                    skuValue: cartItem.sku.value,
                    quantity: cartItem.quantity,
                    productId: cartItem.sku.productId,
                    productTranslations: cartItem.sku.product.productTranslations,
                  };
                }),
              },
              products: {
                connect: item.cartItemIds.map((cartItemId) => {
                  const cartItem = cartItemsMap.get(cartItemId)!;
                  return {
                    id: cartItem.sku.product.id,
                  };
                }),
              },
            },
          }),
        ),
      );

      const $deleteCartItems = tx.cartItem.deleteMany({
        where: {
          id: {
            in: allBodyCartItemIds,
          },
        },
      });

      const $updateStockOfSku = Promise.all(
        cartItems.map((cartItem) =>
          tx.sKU.update({
            where: {
              id: cartItem.skuId,
            },
            data: {
              stock: {
                decrement: cartItem.quantity,
              },
            },
          }),
        ),
      );

      const [orders] = await Promise.all([$createOrders, $deleteCartItems, $updateStockOfSku]);

      return orders;
    });

    return {
      data: orders,
    };
  }

  async findById(userId: number, orderId: number) {
    const order = await this.prismaService.order.findUniqueOrThrow({
      where: {
        id: orderId,
        userId,
        deletedAt: null,
      },
      include: {
        items: true,
      },
    });

    return order;
  }

  async cancelOrder(userId: number, orderId: number) {
    const order = await this.prismaService.order.update({
      where: {
        id: orderId,
        userId,
        status: {
          not: OrderStatus.CANCELLED,
        },
      },
      data: {
        status: OrderStatus.CANCELLED,
        updatedById: userId,
      },
    });

    return order;
  }
}
