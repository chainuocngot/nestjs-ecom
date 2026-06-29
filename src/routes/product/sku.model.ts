import { z } from 'zod';

export const SkuSchema = z.object({
  id: z.number().int(),
  value: z.string(),
  price: z.number(),
  stock: z.number().int(),
  image: z.string(),
  productId: z.number().int(),
  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  deletedById: z.number().int().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UpsertSkuBodySchema = SkuSchema.pick({
  value: true,
  price: true,
  stock: true,
  image: true,
});

export type SkuType = z.infer<typeof SkuSchema>;

export type UpsertSkuBodyType = z.infer<typeof UpsertSkuBodySchema>;
