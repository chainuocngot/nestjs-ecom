import { Injectable } from '@nestjs/common';
import {
  CreateCategoryBodyType,
  GetListCategoryQueryType,
  UpdateCategoryBodyType,
} from 'src/routes/category/category.model';
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/translation.constant';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getListCategory({ page, limit }: GetListCategoryQueryType, languageId: string) {
    const skip = (page - 1) * limit;
    const [total, records] = await Promise.all([
      this.prismaService.category.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.category.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          categoryTranslations: {
            where: languageId !== ALL_LANGUAGE_CODE ? { deletedAt: null, languageId } : { deletedAt: null },
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

  findById(categoryId: number, languageId: string) {
    return this.prismaService.category.findUniqueOrThrow({
      where: {
        id: categoryId,
        deletedAt: null,
      },
      include: {
        categoryTranslations: {
          where: languageId !== ALL_LANGUAGE_CODE ? { deletedAt: null, languageId } : { deletedAt: null },
        },
      },
    });
  }

  create(createdById: number, body: CreateCategoryBodyType) {
    return this.prismaService.category.create({
      data: {
        ...body,
        createdById,
      },
    });
  }

  update({
    updatedById,
    body,
    categoryId,
    languageId,
  }: {
    updatedById: number;
    body: UpdateCategoryBodyType;
    categoryId: number;
    languageId: string;
  }) {
    return this.prismaService.category.update({
      where: {
        id: categoryId,
        deletedAt: null,
      },
      data: {
        ...body,
        updatedById,
      },
      include: {
        categoryTranslations: {
          where: languageId !== ALL_LANGUAGE_CODE ? { deletedAt: null, languageId } : { deletedAt: null },
        },
      },
    });
  }

  delete(deletedById: number, categoryId: number) {
    return this.prismaService.category.update({
      where: {
        id: categoryId,
        deletedAt: null,
      },
      data: {
        deletedById,
        deletedAt: new Date(),
      },
    });
  }
}
