import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { CANCEL_PAYMENT_JOB_NAME, PAYMENT_QUEUE_NAME } from 'src/shared/constants/app.constant';
import { generateCancelPaymentJobId } from 'src/shared/utils';

@Injectable()
export class OrderProducer {
  constructor(@InjectQueue(PAYMENT_QUEUE_NAME) private paymentQueue: Queue) {}

  async addCancelPaymentJob(paymentId: number) {
    return this.paymentQueue.add(
      CANCEL_PAYMENT_JOB_NAME,
      {
        paymentId,
      },
      {
        delay: 20 * 1000, //20s
        jobId: generateCancelPaymentJobId(paymentId),
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
}
