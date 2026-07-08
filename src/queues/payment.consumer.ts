import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CANCEL_PAYMENT_JOB_NAME, PAYMENT_QUEUE_NAME } from 'src/shared/constants/app.constant';

@Processor(PAYMENT_QUEUE_NAME)
export class PaymentConsumer extends WorkerHost {
  process(job: Job<{ paymentId: number }, void>) {
    switch (job.name) {
      case CANCEL_PAYMENT_JOB_NAME: {
        break;
      }
      default: {
        break;
      }
    }
  }
}
