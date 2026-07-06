import { ProductTranslationSchema } from 'src/routes/product/product-translation/product-translation.model';
import { ProductSchema } from 'src/routes/product/product.model';
import { SkuSchema } from 'src/routes/product/sku.model';
import { PaginationQuerySchema } from 'src/shared/models/request.model';
import { UserSchema } from 'src/shared/models/shared-user.model';
import { z } from 'zod';

export const CartItemSchema = z.object({
  id: z.number().int(),
  quantity: z.number().int().positive(),
  skuId: z.number().int(),
  userId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetListCartItemQuerySchema = PaginationQuerySchema;

export const GetCartItemDetailParamSchema = z.object({
  cartItemId: z.coerce.number().int(),
});

export const CartItemDetailSchema = z.object({
  shop: UserSchema.pick({
    id: true,
    name: true,
    avatar: true,
  }),
  cartItems: z.array(
    CartItemSchema.extend({
      sku: SkuSchema.extend({
        product: ProductSchema.extend({
          productTranslations: z.array(ProductTranslationSchema),
        }),
      }),
    }),
  ),
});

export const GetCartResSchema = z.object({
  records: z.array(CartItemDetailSchema),
  total: z.number().int(),
});

export const AddToCartBodySchema = CartItemSchema.pick({
  skuId: true,
  quantity: true,
}).strict();

export const UpdateCartItemBodySchema = AddToCartBodySchema;

export const DeleteCartBodySchema = z
  .object({
    cartItemIds: z.array(z.number().int()),
  })
  .strict();

export type CartItemType = z.infer<typeof CartItemSchema>;

export type GetListCartItemQueryType = z.infer<typeof GetListCartItemQuerySchema>;

export type GetCartItemDetailParamType = z.infer<typeof GetCartItemDetailParamSchema>;

export type CartItemDetailType = z.infer<typeof CartItemDetailSchema>;

export type GetCartResType = z.infer<typeof GetCartResSchema>;

export type AddToCartBodyType = z.infer<typeof AddToCartBodySchema>;

export type UpdateCartItemBodyType = z.infer<typeof UpdateCartItemBodySchema>;

export type DeleteCartBodyType = z.infer<typeof DeleteCartBodySchema>;
