import { Injectable } from '@nestjs/common';
import { CreateUserBodyType, GetListUserQueryType, UpdateUserBodyType } from 'src/routes/user/user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getListUser({ page, limit }: GetListUserQueryType) {
    const skip = (page - 1) * limit;
    const [total, records] = await Promise.all([
      this.prismaService.user.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.user.findMany({
        where: {
          deletedAt: null,
        },
        skip,
        take: limit,
        include: {
          role: true,
        },
      }),
    ]);

    return {
      total,
      records,
    };
  }

  findById(userId: number) {
    return this.prismaService.user.findUniqueOrThrow({
      where: {
        id: userId,
        deletedAt: null,
      },
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

  create(createdById: number, body: CreateUserBodyType) {
    return this.prismaService.user.create({
      data: {
        ...body,
        createdById,
      },
    });
  }

  update({ updatedById, body, userId }: { updatedById: number; body: UpdateUserBodyType; userId: number }) {
    return this.prismaService.user.update({
      where: {
        id: userId,
        deletedAt: null,
      },
      data: {
        ...body,
        updatedById,
      },
    });
  }

  delete({ deletedById, userId }: { deletedById: number; userId: number }) {
    return this.prismaService.user.update({
      where: {
        id: userId,
        deletedAt: null,
      },
      data: {
        deletedById,
      },
    });
  }
}
