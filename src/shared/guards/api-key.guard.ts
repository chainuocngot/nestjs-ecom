import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const xApiKey = request.headers['x-api-key'] as string;
    if (!xApiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    if (xApiKey !== process.env.API_KEY_SECRET) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
