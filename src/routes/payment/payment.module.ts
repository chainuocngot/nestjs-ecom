import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentRepository } from 'src/routes/payment/payment.repository';
import { PaymentProducer } from 'src/routes/payment/payment.producer';
import { BullModule } from '@nestjs/bullmq';
import { PAYMENT_QUEUE_NAME } from 'src/shared/constants/app.constant';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository, PaymentProducer],
  imports: [
    BullModule.registerQueue({
      name: PAYMENT_QUEUE_NAME,
    }),
  ],
})
export class PaymentModule {}
