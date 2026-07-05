import { ProductTranslationSchema } from 'src/routes/product/product-translation/product-translation.model';
import { ProductSchema } from 'src/routes/product/product.model';
import { SkuSchema } from 'src/routes/product/sku.model';
import { z } from 'zod';

export const CartItemSchema = z.object({
  id: z.number().int(),
  quantity: z.number().int().positive(),
  skuId: z.number().int(),
  userId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetCartItemDetailParamSchema = z.object({
  cartItemId: z.coerce.number().int(),
});

export const CartItemDetailSchema = CartItemSchema.extend({
  sku: SkuSchema.extend({
    product: ProductSchema.extend({
      productTranslations: z.array(ProductTranslationSchema),
    }),
  }),
});

export const GetCartResSchema = z.object({
  records: z.array(CartItemSchema),
  total: z.number().int(),
});

export const AddToCartBodySchema = CartItemSchema.pick({
  skuId: true,
  quantity: true,
}).strict();

export const UpdateCartItemBodySchema = AddToCartBodySchema.partial();

export const DeleteCartBodySchema = z
  .object({
    cartItemIds: z.array(z.number().int()),
  })
  .strict();

export type CartItemType = z.infer<typeof CartItemSchema>;

export type GetCartItemDetailParamType = z.infer<typeof GetCartItemDetailParamSchema>;

export type CartItemDetailType = z.infer<typeof CartItemDetailSchema>;

export type GetCartResType = z.infer<typeof GetCartResSchema>;

export type AddToCartBodyType = z.infer<typeof AddToCartBodySchema>;

export type UpdateCartItemBodyType = z.infer<typeof UpdateCartItemBodySchema>;

export type DeleteCartBodyType = z.infer<typeof DeleteCartBodySchema>;
