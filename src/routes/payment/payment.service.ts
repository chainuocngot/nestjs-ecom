import { Injectable } from '@nestjs/common';
import { WebhookPaymentBodyType } from 'src/routes/payment/payment.model';
import { PaymentProducer } from 'src/routes/payment/payment.producer';
import { PaymentRepository } from 'src/routes/payment/payment.repository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentProducer: PaymentProducer,
  ) {}

  async receiver(body: WebhookPaymentBodyType) {
    const paymentId = await this.paymentRepository.receiver(body);

    await this.paymentProducer.removeCancelJob(paymentId);

    return {
      message: 'Thanh toán thành công',
    };
  }
}
