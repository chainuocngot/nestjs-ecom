import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from 'date-fns';
import { OrderIncludeProductSKUSnapshotType } from 'src/routes/order/order.model';
import { WebhookPaymentBodyType } from 'src/routes/payment/payment.model';
import { PREFIX_PAYMENT_CODE } from 'src/shared/constants/app.constant';
import { OrderStatus } from 'src/shared/constants/order.constant';
import { PaymentStatus } from 'src/shared/constants/payment.constant';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class PaymentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async receiver(body: WebhookPaymentBodyType) {
    let amountIn = 0;
    let amountOut = 0;

    if (body.transferType === 'in') {
      amountIn = body.transferAmount;
    } else if (body.transferType === 'out') {
      amountOut = body.transferAmount;
    }

    await this.prismaService.paymentTransaction.create({
      data: {
        gateway: body.gateway,
        transactionDate: parse(body.transactionDate, 'yyyy-MM-dd HH:mm:ss', new Date()),
        accountNumber: body.accountNumber,
        subAccount: body.subAccount,
        accumulated: body.accumulated,
        code: body.code,
        transactionContent: body.content,
        referenceNumber: body.referenceCode,
        body: body.description,
        amountIn,
        amountOut,
      },
    });

    const paymentId = body.code
      ? Number(body.code.split(PREFIX_PAYMENT_CODE)[1])
      : Number(body.content?.split(PREFIX_PAYMENT_CODE)[1]);

    if (isNaN(paymentId)) {
      throw new BadRequestException('Error.CanNotGetPaymentIdFromContent');
    }

    const payment = await this.prismaService.payment.findUnique({
      where: {
        id: paymentId,
      },
      include: {
        orders: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!payment) {
      throw new BadRequestException('Error.PaymentNotFound');
    }

    const { orders } = payment;
    const totalPrice = this._getTotalPrice(orders);

    if (totalPrice !== body.transferAmount) {
      throw new BadRequestException('Error.TotalPriceIsNotEqualToTransferAmount');
    }

    await this.prismaService.$transaction(async (tx) => {
      await tx.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: PaymentStatus.SUCCESS,
        },
      });
      await tx.order.updateMany({
        where: {
          id: {
            in: orders.map((order) => order.id),
          },
        },
        data: {
          status: OrderStatus.PENDING_PICKUP,
        },
      });
    });
  }

  private _getTotalPrice(orders: OrderIncludeProductSKUSnapshotType[]) {
    return orders.reduce((acc, order) => {
      const totalPriceSingleOrder = order.items.reduce((accOrder, skuSnapshot) => {
        return (accOrder += skuSnapshot.skuPrice * skuSnapshot.quantity);
      }, 0);

      return (acc += totalPriceSingleOrder);
    }, 0);
  }
}
