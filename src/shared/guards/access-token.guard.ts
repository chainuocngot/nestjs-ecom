import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { HTTPMethod } from 'src/generated/prisma/enums';
import { REQUEST_USER_KEY } from 'src/shared/constants/auth.constant';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TokenService } from 'src/shared/services/token.service';
import { AccessTokenPayload } from 'src/shared/types/jwt.type';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const decodedAccessToken = await this._extractAndValidateToken(request);
    await this._validateUser(decodedAccessToken, request);

    return true;
  }

  private async _extractAndValidateToken(request: Request): Promise<AccessTokenPayload> {
    const accessToken = this._extractAccessTokenFromHeader(request);

    try {
      const decodedAccessToken = await this.tokenService.verifyAccessToken(accessToken);
      request[REQUEST_USER_KEY] = decodedAccessToken;
      return decodedAccessToken;
    } catch {
      throw new UnauthorizedException('Error.InvalidAccessToken');
    }
  }

  private _extractAccessTokenFromHeader(request: Request): string {
    const accessToken = request.headers['authorization']?.split(' ')[1] as string;
    if (!accessToken) {
      throw new UnauthorizedException('Error.MissingAccessToken');
    }

    return accessToken;
  }

  private async _validateUser(decodedAccessToken: AccessTokenPayload, request: Request): Promise<void> {
    const roleId = decodedAccessToken.roleId;
    const path = (request.route as { path: string }).path;
    const method = request.method as HTTPMethod;
    const role = await this.prismaService.role
      .findUniqueOrThrow({
        where: {
          id: roleId,
          deletedAt: null,
        },
        include: {
          permissions: {
            where: {
              deletedAt: null,
              path,
              method,
            },
          },
        },
      })
      .catch(() => {
        throw new ForbiddenException();
      });

    const canAccess = role.permissions.length > 0;

    if (!canAccess) {
      throw new ForbiddenException();
    }
  }
}
