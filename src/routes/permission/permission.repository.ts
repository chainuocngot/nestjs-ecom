import { Injectable } from '@nestjs/common';
import {
  CreatePermissionBodyType,
  GetListPermissionQueryType,
  UpdatePermissionBodyType,
} from 'src/routes/permission/permission.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class PermissionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getListPermission({ page, limit }: GetListPermissionQueryType) {
    const skip = (page - 1) * limit;
    const [total, records] = await Promise.all([
      this.prismaService.permission.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.permission.findMany({
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

  findById(permissionId: number) {
    return this.prismaService.permission.findUniqueOrThrow({
      where: {
        id: permissionId,
        deletedAt: null,
      },
    });
  }

  create(createdById: number, body: CreatePermissionBodyType) {
    return this.prismaService.permission.create({
      data: {
        ...body,
        createdById,
      },
    });
  }

  update({
    updatedById,
    body,
    permissionId,
  }: {
    updatedById: number;
    body: UpdatePermissionBodyType;
    permissionId: number;
  }) {
    return this.prismaService.permission.update({
      where: {
        id: permissionId,
        deletedAt: null,
      },
      data: { ...body, updatedById },
    });
  }

  delete(deletedById: number, permissionId: number) {
    return this.prismaService.permission.update({
      where: {
        id: permissionId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        deletedById,
      },
    });
  }
}
