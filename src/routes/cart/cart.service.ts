import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { CartItemNotFoundException } from 'src/routes/cart/cart.error';
import {
  AddToCartBodyType,
  DeleteCartBodyType,
  GetListCartItemQueryType,
  UpdateCartItemBodyType,
} from 'src/routes/cart/cart.model';
import { CartRepository } from 'src/routes/cart/cart.repository';
import { isNotFoundPrismaError } from 'src/shared/utils';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  getCart({ query, userId }: { query: GetListCartItemQueryType; userId: number }) {
    return this.cartRepository.getListCartItem({
      query,
      userId,
      languageId: I18nContext.current()?.lang as string,
    });
  }

  create(userId: number, body: AddToCartBodyType) {
    return this.cartRepository.create(userId, body);
  }

  async update({ userId, cartItemId, body }: { userId: number; cartItemId: number; body: UpdateCartItemBodyType }) {
    try {
      return await this.cartRepository.update({ userId, cartItemId, body });
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw CartItemNotFoundException;
      }

      throw error;
    }
  }

  async delete(userId: number, body: DeleteCartBodyType) {
    await this.cartRepository.delete(userId, body);

    return {
      message: 'Xóa thành công',
    };
  }
}
