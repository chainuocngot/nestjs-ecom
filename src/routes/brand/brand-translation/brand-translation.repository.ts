import { Injectable } from '@nestjs/common';
import {
  CreateBrandTranslationBodyType,
  UpdateBrandTranslationBodyType,
} from 'src/routes/brand/brand-translation/brand-translation.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class BrandTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findById(brandTranslationId: number) {
    return this.prismaService.brandTranslation.findUniqueOrThrow({
      where: {
        id: brandTranslationId,
        deletedAt: null,
      },
    });
  }

  create(createdById: number, body: CreateBrandTranslationBodyType) {
    return this.prismaService.brandTranslation.create({
      data: {
        ...body,
        createdById,
      },
    });
  }

  update({
    updatedById,
    body,
    brandTranslationId,
  }: {
    updatedById: number;
    body: UpdateBrandTranslationBodyType;
    brandTranslationId: number;
  }) {
    return this.prismaService.brandTranslation.update({
      where: {
        id: brandTranslationId,
        deletedAt: null,
      },
      data: {
        ...body,
        updatedById,
      },
    });
  }

  delete(deletedById: number, brandTranslationId: number) {
    return this.prismaService.brandTranslation.update({
      where: {
        id: brandTranslationId,
        deletedAt: null,
      },
      data: {
        deletedById,
        deletedAt: new Date(),
      },
    });
  }
}
