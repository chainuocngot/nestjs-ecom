import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
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
  @ZodSerializerDto(GetCartResDto)
  getCart(@ActiveUser('userId') userId: number, @Query() query: GetListCartItemQueryDto) {
    return this.cartService.getCart({
      query,
      userId,
    });
  }

  @Post()
  @ZodSerializerDto(CartItemDto)
  addToCart(@Body() body: AddToCartBodyDto, @ActiveUser('userId') userId: number) {
    return this.cartService.create(userId, body);
  }

  @Put(':cartItemId')
  @ZodSerializerDto(CartItemDto)
  updateCartItem(@Param() param: GetCartItemDetailParamDto, @Body() body: UpdateCartItemBodyDto) {
    return this.cartService.update(param.cartItemId, body);
  }

  @Post('delete')
  @ZodSerializerDto(MessageResDto)
  deleteCartItem(@ActiveUser('userId') userId: number, @Body() body: DeleteCartBodyDto) {
    return this.cartService.delete(userId, body);
  }
}
