import { Injectable } from '@nestjs/common';
import { GetListProductQueryType } from 'src/routes/product/product.model';
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/translation.constant';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getListProduct({ limit, page }: GetListProductQueryType, languageId: string) {
    const now = new Date();
    const skip = (page - 1) * limit;

    const [total, records] = await Promise.all([
      this.prismaService.product.count({
        where: {
          deletedAt: null,
          publishedAt: {
            lt: now,
          },
        },
      }),
      this.prismaService.product.findMany({
        where: {
          deletedAt: null,
          publishedAt: {
            lt: now,
          },
        },
        skip,
        take: limit,
        include: {
          productTranslations: {
            where: languageId !== ALL_LANGUAGE_CODE ? { deletedAt: null, languageId } : { deletedAt: null },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      total,
      records,
    };
  }
}
