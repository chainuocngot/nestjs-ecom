import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const paymentApiKey = request.headers['payment-api-key'] as string;
    if (!paymentApiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    if (paymentApiKey !== process.env.PAYMENT_API_KEY) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
