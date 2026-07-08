import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PAYMENT_QUEUE_NAME } from 'src/shared/constants/app.constant';
import { generateCancelPaymentJobId } from 'src/shared/utils';

@Injectable()
export class PaymentProducer {
  constructor(@InjectQueue(PAYMENT_QUEUE_NAME) private paymentQueue: Queue) {}

  async removeCancelJob(paymentId: number) {
    return this.paymentQueue.remove(generateCancelPaymentJobId(paymentId));
  }
}
