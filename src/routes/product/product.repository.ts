import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import {
  CreateProductBodyType,
  GetListProductQueryType,
  UpdateProductBodyType,
} from 'src/routes/product/product.model';
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/translation.constant';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getListProduct(
    {
      limit,
      page,
      // name, brandIds, categoryIds, minPrice, maxPrice,
      createdById,
      isPublic,
    }: GetListProductQueryType,
    languageId: string,
  ) {
    const now = new Date();
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      createdById,
      publishedAt: isPublic ? { lte: now } : undefined,
    };

    const [total, records] = await Promise.all([
      this.prismaService.product.count({
        where,
      }),
      this.prismaService.product.findMany({
        where,
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

  findById(productId: number) {
    return this.prismaService.product.findUniqueOrThrow({
      where: {
        id: productId,
        deletedAt: null,
      },
    });
  }

  getDetailById({ productId, languageId, isPublic }: { productId: number; languageId: string; isPublic?: boolean }) {
    const now = new Date();
    return this.prismaService.product.findUniqueOrThrow({
      where: {
        id: productId,
        deletedAt: null,
        publishedAt: isPublic ? { lte: now } : undefined,
      },
      include: {
        productTranslations: {
          where: languageId !== ALL_LANGUAGE_CODE ? { deletedAt: null, languageId } : { deletedAt: null },
        },
        skus: {
          where: {
            deletedAt: null,
          },
        },
        brand: {
          include: {
            brandTranslations: {
              where: languageId !== ALL_LANGUAGE_CODE ? { deletedAt: null, languageId } : { deletedAt: null },
            },
          },
        },
        categories: {
          where: {
            deletedAt: null,
          },
          include: {
            categoryTranslations: {
              where: languageId !== ALL_LANGUAGE_CODE ? { deletedAt: null, languageId } : { deletedAt: null },
            },
          },
        },
      },
    });
  }

  create({ createdById, body, languageId }: { createdById: number; body: CreateProductBodyType; languageId: string }) {
    const { skus, categories, ...createProductPayload } = body;

    return this.prismaService.product.create({
      data: {
        ...createProductPayload,
        createdById,
        categories: {
          //IMPORTANT: Many-Many Create
          connect: categories.map((category) => ({ id: category })),
        },
        skus: {
          //IMPORTANT: One-Many Create
          createMany: {
            data: skus,
          },
        },
      },
      include: {
        productTranslations: {
          where: languageId !== ALL_LANGUAGE_CODE ? { deletedAt: null, languageId } : { deletedAt: null },
        },
        skus: {
          where: {
            deletedAt: null,
          },
        },
        brand: {
          include: {
            brandTranslations: {
              where: languageId !== ALL_LANGUAGE_CODE ? { deletedAt: null, languageId } : { deletedAt: null },
            },
          },
        },
        categories: {
          where: {
            deletedAt: null,
          },
          include: {
            categoryTranslations: {
              where: languageId !== ALL_LANGUAGE_CODE ? { deletedAt: null, languageId } : { deletedAt: null },
            },
          },
        },
      },
    });
  }

  async update({
    updatedById,
    body,
    productId,
  }: {
    updatedById: number;
    body: UpdateProductBodyType;
    productId: number;
  }) {
    const { skus: skusPayload, categories, ...updateProductPayload } = body;

    const existingSkus = await this.prismaService.sKU.findMany({
      where: {
        deletedAt: null,
        productId,
      },
    });

    // Các sku cần xoá (Có trong DB nhưng không có trong payload)
    const skusToDelete = existingSkus.filter((sku) =>
      skusPayload.every((skuPayload) => skuPayload.value !== sku.value),
    );
    const skusToDeleteIds = skusToDelete.map((sku) => sku.id);

    // Mapping để chuẩn bị cho các sku cần tạo và cập nhật
    const skusWithId = skusPayload.map((sku) => {
      const existingSku = existingSkus.find((existingSku) => existingSku.value === sku.value);
      return {
        ...sku,
        id: existingSku ? existingSku.id : null,
      };
    });

    const skusToUpdate = skusWithId.filter((sku) => sku.id !== null);
    const skusToCreate = skusWithId
      .filter((sku) => sku.id === null)
      .map((sku) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...skuData } = sku;

        return {
          ...skuData,
          productId,
          createdById: updatedById,
        };
      });

    const [product] = await this.prismaService.$transaction([
      //Cập nhật product
      this.prismaService.product.update({
        where: {
          id: productId,
          deletedAt: null,
        },
        data: {
          ...updateProductPayload,
          updatedById,
          categories: {
            connect: categories.map((category) => ({ id: category })),
          },
        },
      }),
      //Xoá sku
      this.prismaService.sKU.updateMany({
        where: {
          id: {
            in: skusToDeleteIds,
          },
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
          deletedById: updatedById,
        },
      }),
      //Cập nhật sku
      ...skusToUpdate.map((sku) =>
        this.prismaService.sKU.update({
          where: {
            id: sku.id as number,
            deletedAt: null,
          },
          data: {
            image: sku.image,
            price: sku.price,
            stock: sku.stock,
            value: sku.value,
            updatedById,
          },
        }),
      ),
      //Tạo sku
      this.prismaService.sKU.createMany({
        data: skusToCreate,
      }),
    ]);

    return product;
  }

  delete(deletedById: number, productId: number) {
    const now = new Date();
    return Promise.all([
      this.prismaService.product.update({
        where: {
          id: productId,
          deletedAt: null,
        },
        data: {
          deletedAt: now,
          deletedById,
        },
      }),
      this.prismaService.productTranslation.updateMany({
        where: {
          deletedAt: null,
          productId,
        },
        data: {
          deletedAt: now,
          deletedById,
        },
      }),
      this.prismaService.sKU.updateMany({
        where: {
          deletedAt: null,
          productId,
        },
        data: {
          deletedAt: now,
          deletedById,
        },
      }),
    ]);
  }
}
