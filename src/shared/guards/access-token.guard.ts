import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { Request } from 'express';
import { keyBy } from 'lodash';
import { HTTPMethod } from 'src/generated/prisma/enums';
import { RoleIncludePermissionsType } from 'src/routes/role/role.model';
import { REQUEST_USER_KEY } from 'src/shared/constants/auth.constant';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TokenService } from 'src/shared/services/token.service';
import { AccessTokenPayload } from 'src/shared/types/jwt.type';

type Permission = RoleIncludePermissionsType['permissions'][number];
type CachedRole = RoleIncludePermissionsType & {
  permissions: {
    [key: string]: Permission;
  };
};

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

    const cacheKey = `role:${roleId}`;
    let cachedRole = await this.cacheManager.get<CachedRole>(cacheKey);

    if (cachedRole === undefined) {
      const role = await this.prismaService.role
        .findUniqueOrThrow({
          where: {
            id: roleId,
            isActive: true,
            deletedAt: null,
          },
          include: {
            permissions: {
              where: {
                deletedAt: null,
              },
            },
          },
        })
        .catch(() => {
          throw new ForbiddenException();
        });

      const permissionObject = keyBy(
        role.permissions,
        (permission) => `${permission.path}:${permission.method}`,
      ) as unknown as CachedRole['permissions'];

      cachedRole = { ...role, permissions: permissionObject };
      await this.cacheManager.set(cacheKey, cachedRole, 1000 * 60 * 60);
    }

    const canAccess: Permission | undefined = cachedRole.permissions[`${path}:${method}`];

    if (!canAccess) {
      throw new ForbiddenException();
    }
  }
}
