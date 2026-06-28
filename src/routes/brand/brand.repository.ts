import { Injectable } from '@nestjs/common';
import { CreateBrandBodyType, GetListBrandQueryType, UpdateBrandBodyType } from 'src/routes/brand/brand.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class BrandRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getListBrand({ page, limit }: GetListBrandQueryType, languageId?: string) {
    const skip = (page - 1) * limit;
    const [total, records] = await Promise.all([
      this.prismaService.brand.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.brand.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          brandTranslations: {
            where: languageId ? { deletedAt: null, languageId } : { deletedAt: null },
          },
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

  findById(brandId: number, languageId?: string) {
    return this.prismaService.brand.findUniqueOrThrow({
      where: {
        id: brandId,
        deletedAt: null,
      },
      include: {
        brandTranslations: {
          where: languageId ? { deletedAt: null, languageId } : { deletedAt: null },
        },
      },
    });
  }

  create(createdById: number, body: CreateBrandBodyType) {
    return this.prismaService.brand.create({
      data: {
        ...body,
        createdById,
      },
    });
  }

  update({
    updatedById,
    body,
    brandId,
    languageId,
  }: {
    updatedById: number;
    body: UpdateBrandBodyType;
    brandId: number;
    languageId?: string;
  }) {
    return this.prismaService.brand.update({
      where: {
        id: brandId,
        deletedAt: null,
      },
      data: {
        ...body,
        updatedById,
      },
      include: {
        brandTranslations: {
          where: languageId ? { deletedAt: null, languageId } : { deletedAt: null },
        },
      },
    });
  }

  delete(deletedById: number, brandId: number) {
    return this.prismaService.brand.update({
      where: {
        id: brandId,
        deletedAt: null,
      },
      data: {
        deletedById,
        deletedAt: new Date(),
      },
    });
  }
}
