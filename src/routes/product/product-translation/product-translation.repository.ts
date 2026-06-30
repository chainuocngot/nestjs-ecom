import { Injectable } from '@nestjs/common';
import {
  CreateProductTranslationBodyType,
  UpdateProductTranslationBodyType,
} from 'src/routes/product/product-translation/product-translation.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class ProductTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findById(productTranslationId: number) {
    return this.prismaService.productTranslation.findUniqueOrThrow({
      where: {
        id: productTranslationId,
        deletedAt: null,
      },
    });
  }

  create(createdById: number, body: CreateProductTranslationBodyType) {
    return this.prismaService.productTranslation.create({
      data: {
        ...body,
        createdById,
      },
    });
  }

  update({
    updatedById,
    body,
    productTranslationId,
  }: {
    updatedById: number;
    body: UpdateProductTranslationBodyType;
    productTranslationId: number;
  }) {
    return this.prismaService.productTranslation.update({
      where: {
        id: productTranslationId,
        deletedAt: null,
      },
      data: {
        ...body,
        updatedById,
      },
    });
  }

  delete(deletedById: number, productTranslationId: number) {
    return this.prismaService.productTranslation.update({
      where: {
        id: productTranslationId,
        deletedAt: null,
      },
      data: {
        deletedById,
        deletedAt: new Date(),
      },
    });
  }
}
