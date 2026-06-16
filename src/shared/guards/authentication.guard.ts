import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant';
import { AUTH_TYPE_KEY, AuthTypeDecoratorPayload } from 'src/shared/decorators/auth.decorator';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly authTypeGuardMap: Record<string, CanActivate> = {
    [AuthType.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: ApiKeyGuard,
  ) {
    this.authTypeGuardMap[AuthType.Bearer] = this.accessTokenGuard;
    this.authTypeGuardMap[AuthType.ApiKey] = this.apiKeyGuard;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypeValue = this.reflector.getAllAndOverride<AuthTypeDecoratorPayload | undefined>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? { authTypes: [AuthType.Bearer], options: { condition: ConditionGuard.Or } };

    const guards = authTypeValue.authTypes.map((authType) => this.authTypeGuardMap[authType]);
    let error = new UnauthorizedException();
    if (authTypeValue.options.condition === ConditionGuard.Or) {
      for (const instance of guards) {
        const canActive = await Promise.resolve(instance.canActivate(context)).catch((err: HttpException) => {
          error = err;
          return false;
        });
        if (canActive) {
          return true;
        }
      }

      throw error;
    } else {
      for (const instance of guards) {
        const canActive = await instance.canActivate(context);
        if (!canActive) {
          throw new UnauthorizedException();
        }
      }

      return true;
    }
  }
}
