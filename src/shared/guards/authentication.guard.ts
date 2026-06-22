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
    const authTypeValue = this._getAuthTypeValue(context);
    const guards = authTypeValue.authTypes.map((authType) => this.authTypeGuardMap[authType]);

    return authTypeValue.options.condition === ConditionGuard.And
      ? this._handleAndCondition(guards, context)
      : this._handleOrCondition(guards, context);
  }

  private _getAuthTypeValue(context: ExecutionContext) {
    const authTypeValue = this.reflector.getAllAndOverride<AuthTypeDecoratorPayload | undefined>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? { authTypes: [AuthType.Bearer], options: { condition: ConditionGuard.And } };

    return authTypeValue;
  }

  private async _handleOrCondition(guards: CanActivate[], context: ExecutionContext) {
    let lastError: HttpException | Error | null = null;

    for (const guard of guards) {
      try {
        if (await guard.canActivate(context)) {
          return true;
        }
      } catch (error) {
        lastError = error as Error;
      }
    }

    if (lastError instanceof HttpException) {
      throw lastError;
    }
    throw new UnauthorizedException();
  }

  private async _handleAndCondition(guards: CanActivate[], context: ExecutionContext) {
    for (const guard of guards) {
      try {
        if (!(await guard.canActivate(context))) {
          throw new UnauthorizedException();
        }
      } catch (error) {
        if (error instanceof HttpException) {
          throw error;
        }
        throw new UnauthorizedException();
      }
    }

    return true;
  }
}
