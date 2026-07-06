import { Injectable } from '@nestjs/common';
import { ProductNotFoundException, SkuNotFoundException, SkuOutOfStockException } from 'src/routes/cart/cart.error';
import {
  AddToCartBodyType,
  DeleteCartBodyType,
  GetListCartItemQueryType,
  UpdateCartItemBodyType,
} from 'src/routes/cart/cart.model';
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/translation.constant';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class CartRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getListCartItem({
    query,
    userId,
    languageId,
  }: {
    query: GetListCartItemQueryType;
    userId: number;
    languageId: string;
  }) {
    const skip = (query.page - 1) * query.limit;

    const [total, records] = await Promise.all([
      this.prismaService.cartItem.count({
        where: {
          userId,
        },
      }),
      this.prismaService.cartItem.findMany({
        where: {
          userId,
        },
        include: {
          sku: {
            include: {
              product: {
                include: {
                  productTranslations: {
                    where: languageId !== ALL_LANGUAGE_CODE ? { deletedAt: null, languageId } : { deletedAt: null },
                  },
                },
              },
            },
          },
        },
        skip,
        take: query.limit,
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

  async create(userId: number, body: AddToCartBodyType) {
    await this._validateSku(body.skuId);

    return this.prismaService.cartItem.create({
      data: {
        ...body,
        userId,
      },
    });
  }

  async update(cartItemId: number, body: UpdateCartItemBodyType) {
    await this._validateSku(body.skuId);

    return this.prismaService.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: body,
    });
  }

  async delete(userId: number, body: DeleteCartBodyType) {
    return this.prismaService.cartItem.deleteMany({
      where: {
        id: {
          in: body.cartItemIds,
        },
        userId,
      },
    });
  }

  private async _validateSku(skuId: number) {
    const sku = await this.prismaService.sKU.findUnique({
      where: {
        deletedAt: null,
        id: skuId,
      },
      include: {
        product: true,
      },
    });

    if (!sku) {
      throw SkuNotFoundException;
    }

    if (sku.stock < 1) {
      throw SkuOutOfStockException;
    }

    const { product } = sku;

    if (
      product.deletedAt !== null ||
      product.publishedAt === null ||
      (product.publishedAt !== null && product.publishedAt > new Date())
    ) {
      throw ProductNotFoundException;
    }

    return sku;
  }
}
