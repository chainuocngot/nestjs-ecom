import { Injectable } from '@nestjs/common';
import { ProductNotFoundException, SkuNotFoundException, SkuOutOfStockException } from 'src/routes/cart/cart.error';
import {
  AddToCartBodyType,
  CartItemDetailType,
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
    const cartItems = await this.prismaService.cartItem.findMany({
      where: {
        userId,
        sku: {
          product: {
            deletedAt: null,
            publishedAt: {
              lte: new Date(),
              not: null,
            },
          },
        },
      },
      include: {
        sku: {
          include: {
            product: {
              include: {
                productTranslations: {
                  where: languageId !== ALL_LANGUAGE_CODE ? { deletedAt: null, languageId } : { deletedAt: null },
                },
                createdBy: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const groupMap = new Map<number, CartItemDetailType>();
    for (const cartItem of cartItems) {
      const shopId = cartItem.sku.product.createdById;
      if (shopId) {
        if (!groupMap.has(shopId)) {
          groupMap.set(shopId, { shop: cartItem.sku.product.createdBy, cartItems: [] });
        }

        groupMap.get(shopId)?.cartItems.push(cartItem);
      }
    }

    const sortedGroups = Array.from(groupMap.values());

    const skip = (query.page - 1) * query.limit;
    const pagedRecords = sortedGroups.slice(skip, skip + query.limit);

    return {
      total: sortedGroups.length,
      records: pagedRecords,
    };
  }

  async create(userId: number, body: AddToCartBodyType) {
    await this._validateSku(body.skuId, body.quantity);

    //IMPORTANT: Hàm upsert
    return this.prismaService.cartItem.upsert({
      where: {
        //IMPORTANT: Cặp unique
        userId_skuId: {
          userId,
          skuId: body.skuId,
        },
      },
      update: {
        quantity: {
          increment: body.quantity,
        },
      },
      create: {
        ...body,
        userId,
      },
    });
  }

  async update(cartItemId: number, body: UpdateCartItemBodyType) {
    await this._validateSku(body.skuId, body.quantity);

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

  private async _validateSku(skuId: number, quantity: number) {
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

    if (sku.stock < 1 || sku.stock < quantity) {
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
