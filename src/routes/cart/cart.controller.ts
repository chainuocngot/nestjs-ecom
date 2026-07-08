import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';
import {
  AddToCartBodyDto,
  CartItemDto,
  DeleteCartBodyDto,
  GetCartItemDetailParamDto,
  GetCartResDto,
  GetListCartItemQueryDto,
  UpdateCartItemBodyDto,
} from 'src/routes/cart/cart.dto';
import { CartService } from 'src/routes/cart/cart.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDto } from 'src/shared/dtos/response.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ZodResponse({ type: GetCartResDto })
  getCart(@ActiveUser('userId') userId: number, @Query() query: GetListCartItemQueryDto) {
    return this.cartService.getCart({
      query,
      userId,
    });
  }

  @Post()
  @ZodResponse({ type: CartItemDto })
  addToCart(@Body() body: AddToCartBodyDto, @ActiveUser('userId') userId: number) {
    return this.cartService.create(userId, body);
  }

  @Put(':cartItemId')
  @ZodResponse({ type: CartItemDto })
  updateCartItem(
    @ActiveUser('userId') userId: number,
    @Param() param: GetCartItemDetailParamDto,
    @Body() body: UpdateCartItemBodyDto,
  ) {
    return this.cartService.update({
      cartItemId: param.cartItemId,
      body,
      userId,
    });
  }

  @Post('delete')
  @ZodResponse({ type: MessageResDto })
  deleteCartItem(@ActiveUser('userId') userId: number, @Body() body: DeleteCartBodyDto) {
    return this.cartService.delete(userId, body);
  }
}
