import { createZodDto } from 'nestjs-zod';
import { PaymentSchema, PaymentTransactionSchema, WebhookPaymentBodySchema } from 'src/routes/payment/payment.model';

export class PaymentDto extends createZodDto(PaymentSchema) {}

export class PaymentTransactionDto extends createZodDto(PaymentTransactionSchema) {}

export class WebhookPaymentBodyDto extends createZodDto(WebhookPaymentBodySchema) {}
