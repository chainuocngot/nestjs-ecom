import { Injectable } from '@nestjs/common';
import { PermissionType } from 'src/routes/permission/permission.model';
import { RoleType, UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

type UniqueObjectType = ({ email: string } | { id: number }) & { [key: string]: unknown };
type UserIncludeRolePermissions = UserType & { role: RoleType & { permissions: PermissionType[] } };

@Injectable()
export class SharedUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findUnique(uniqueObject: UniqueObjectType): Promise<UserType | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject,
    });
  }

  findUniqueIncludeRolePermissions(uniqueObject: UniqueObjectType): Promise<UserIncludeRolePermissions | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject,
      include: {
        role: {
          include: {
            permissions: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });
  }
}
