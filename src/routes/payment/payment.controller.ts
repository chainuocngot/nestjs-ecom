import { Body, Controller, Post } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { WebhookPaymentBodyDto } from 'src/routes/payment/payment.dto';
import { PaymentService } from 'src/routes/payment/payment.service';
import { AuthType } from 'src/shared/constants/auth.constant';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { MessageResDto } from 'src/shared/dtos/response.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('receiver')
  @ZodSerializerDto(MessageResDto)
  @Auth([AuthType.PaymentApiKey])
  receiver(@Body() body: WebhookPaymentBodyDto) {
    return this.paymentService.receiver(body);
  }
}
