import { Injectable } from '@nestjs/common';
import { CreateRoleBodyType, GetListRoleQueryType, UpdateRoleBodyType } from 'src/routes/role/role.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class RoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getListRole({ page, limit }: GetListRoleQueryType) {
    const skip = (page - 1) * limit;
    const [total, records] = await Promise.all([
      this.prismaService.role.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.role.findMany({
        where: {
          deletedAt: null,
        },
        skip,
        take: limit,
      }),
    ]);

    return {
      total,
      records,
    };
  }

  findById(roleId: number) {
    return this.prismaService.role.findUniqueOrThrow({
      where: {
        id: roleId,
        deletedAt: null,
      },
      include: {
        permissions: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  create(createdById: number, body: CreateRoleBodyType) {
    return this.prismaService.role.create({
      data: {
        ...body,
        createdById,
      },
    });
  }

  async update({ updatedById, body, roleId }: { updatedById: number; body: UpdateRoleBodyType; roleId: number }) {
    if (body.permissionIds?.length) {
      const permissionsInDb = await this.prismaService.permission.findMany({
        where: {
          id: {
            in: body.permissionIds,
          },
        },
      });
      const deletedPermissionsInDb = permissionsInDb.filter((permission) => permission.deletedAt);
      if (deletedPermissionsInDb.length > 0) {
        const deletedIds = deletedPermissionsInDb.map((permission) => permission.id).join(', ');
        throw new Error(`Permission with id has been deleted: ${deletedIds}`);
      }
    }

    return this.prismaService.role.update({
      where: {
        id: roleId,
        deletedAt: null,
      },
      data: {
        name: body.name,
        description: body.description,
        isActive: body.isActive,
        updatedById,
        permissions: {
          //IMPORTANT: Many-Many Update
          set: body.permissionIds?.map((permissionId) => ({ id: permissionId })),
        },
      },
      include: {
        permissions: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  delete(deletedById: number, roleId: number) {
    return this.prismaService.role.update({
      where: {
        id: roleId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        deletedById,
      },
    });
  }
}
