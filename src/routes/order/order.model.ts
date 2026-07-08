import { ProductTranslationSchema } from 'src/routes/product/product-translation/product-translation.model';
import { OrderStatus } from 'src/shared/constants/order.constant';
import { PaginationQuerySchema } from 'src/shared/models/request.model';
import { z } from 'zod';

const OrderStatusSchema = z.enum(OrderStatus);

export const OrderSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  status: OrderStatusSchema,
  shopId: z.number().int(),
  receiver: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    address: z.string(),
  }),
  paymentId: z.number().int(),
  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  deletedById: z.number().int().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ProductSKUSnapshotSchema = z.object({
  id: z.number().int(),
  productName: z.string(),
  skuPrice: z.number(),
  image: z.string(),
  quantity: z.number().int(),
  skuValue: z.string(),
  productId: z.number().int().nullable(),
  skuId: z.number().int().nullable(),
  orderId: z.number().int().nullable(),
  productTranslations: z.array(
    ProductTranslationSchema.pick({
      id: true,
      name: true,
      description: true,
      languageId: true,
    }),
  ),
  createdAt: z.date(),
});

export const GetListOrderQuerySchema = PaginationQuerySchema.extend({
  status: OrderStatusSchema.optional(),
});

export const GetListOrderResSchema = z.object({
  records: z.array(
    OrderSchema.extend({
      items: z.array(ProductSKUSnapshotSchema),
    }).omit({
      receiver: true,
      deletedAt: true,
      deletedById: true,
      createdById: true,
      updatedById: true,
    }),
  ),
  total: z.number().int(),
});

export const GetOrderDetailResSchema = OrderSchema.extend({
  items: z.array(ProductSKUSnapshotSchema),
});

export const CreateOrderBodySchema = z.array(
  z.object({
    shopId: z.number().int(),
    receiver: z.object({
      name: z.string(),
      phone: z.string(),
      address: z.string(),
      email: z.string(),
    }),
    cartItemIds: z.array(z.number()),
  }),
);

export const CreateOrderResSchema = z.object({
  data: z.array(OrderSchema),
});

export const CancelOrderResSchema = OrderSchema;

export const GetOrderDetailParamSchema = z
  .object({
    orderId: z.coerce.number().int(),
  })
  .strict();

export const OrderIncludeProductSKUSnapshotSchema = OrderSchema.extend({
  items: z.array(ProductSKUSnapshotSchema),
});

export type OrderStatusType = z.infer<typeof OrderStatusSchema>;

export type OrderType = z.infer<typeof OrderSchema>;

export type ProductSKUSnapshotType = z.infer<typeof ProductSKUSnapshotSchema>;

export type GetListOrderQueryType = z.infer<typeof GetListOrderQuerySchema>;

export type GetListOrderResType = z.infer<typeof GetListOrderResSchema>;

export type GetOrderDetailResType = z.infer<typeof GetOrderDetailResSchema>;

export type CreateOrderBodyType = z.infer<typeof CreateOrderBodySchema>;

export type CreateOrderResType = z.infer<typeof CreateOrderResSchema>;

export type CancelOrderResType = z.infer<typeof CancelOrderResSchema>;

export type GetOrderDetailParamType = z.infer<typeof GetOrderDetailParamSchema>;

export type OrderIncludeProductSKUSnapshotType = z.infer<typeof OrderIncludeProductSKUSnapshotSchema>;
