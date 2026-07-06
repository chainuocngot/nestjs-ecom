import { createZodDto } from 'nestjs-zod';
import {
  CartItemSchema,
  GetCartItemDetailParamSchema,
  CartItemDetailSchema,
  GetCartResSchema,
  AddToCartBodySchema,
  UpdateCartItemBodySchema,
  DeleteCartBodySchema,
  GetListCartItemQuerySchema,
} from 'src/routes/cart/cart.model';

export class CartItemDto extends createZodDto(CartItemSchema) {}

export class GetListCartItemQueryDto extends createZodDto(GetListCartItemQuerySchema) {}

export class GetCartItemDetailParamDto extends createZodDto(GetCartItemDetailParamSchema) {}

export class CartItemDetailDto extends createZodDto(CartItemDetailSchema) {}

export class GetCartResDto extends createZodDto(GetCartResSchema) {}

export class AddToCartBodyDto extends createZodDto(AddToCartBodySchema) {}

export class UpdateCartItemBodyDto extends createZodDto(UpdateCartItemBodySchema) {}

export class DeleteCartBodyDto extends createZodDto(DeleteCartBodySchema) {}
