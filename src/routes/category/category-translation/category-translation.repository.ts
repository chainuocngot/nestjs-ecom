import { Injectable } from '@nestjs/common';
import {
  CreateCategoryTranslationBodyType,
  UpdateCategoryTranslationBodyType,
} from 'src/routes/category/category-translation/category-translation.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class CategoryTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findById(categoryTranslationId: number) {
    return this.prismaService.categoryTranslation.findUniqueOrThrow({
      where: {
        id: categoryTranslationId,
        deletedAt: null,
      },
    });
  }

  create(createdById: number, body: CreateCategoryTranslationBodyType) {
    return this.prismaService.categoryTranslation.create({
      data: {
        ...body,
        createdById,
      },
    });
  }

  update({
    updatedById,
    body,
    categoryTranslationId,
  }: {
    updatedById: number;
    body: UpdateCategoryTranslationBodyType;
    categoryTranslationId: number;
  }) {
    return this.prismaService.categoryTranslation.update({
      where: {
        id: categoryTranslationId,
        deletedAt: null,
      },
      data: {
        ...body,
        updatedById,
      },
    });
  }

  delete(deletedById: number, categoryTranslationId: number) {
    return this.prismaService.categoryTranslation.update({
      where: {
        id: categoryTranslationId,
        deletedAt: null,
      },
      data: {
        deletedById,
        deletedAt: new Date(),
      },
    });
  }
}
