import { z } from 'zod';

export const ProductTranslationSchema = z.object({
  id: z.number().int(),
  productId: z.number().int(),
  languageId: z.string(),
  name: z.string(),
  description: z.string(),
  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetProductTranslationDetailParamSchema = z.object({
  productTranslationId: z.coerce.number().int(),
});

export const GetProductTranslationDetailResSchema = ProductTranslationSchema;

export const CreateProductTranslationBodySchema = ProductTranslationSchema.pick({
  productId: true,
  languageId: true,
  name: true,
  description: true,
}).strict();

export const CreateProductTranslationResSchema = ProductTranslationSchema;

export const UpdateProductTranslationParamSchema = GetProductTranslationDetailParamSchema;

export const UpdateProductTranslationBodySchema = CreateProductTranslationBodySchema.partial();

export const UpdateProductTranslationResSchema = ProductTranslationSchema;

export const DeleteProductTranslationParamSchema = GetProductTranslationDetailParamSchema;

export type ProductTranslationType = z.infer<typeof ProductTranslationSchema>;

export type GetProductTranslationDetailParamType = z.infer<typeof GetProductTranslationDetailParamSchema>;

export type GetProductTranslationDetailResType = z.infer<typeof GetProductTranslationDetailResSchema>;

export type CreateProductTranslationBodyType = z.infer<typeof CreateProductTranslationBodySchema>;

export type CreateProductTranslationResType = z.infer<typeof CreateProductTranslationResSchema>;

export type UpdateProductTranslationParamType = z.infer<typeof UpdateProductTranslationParamSchema>;

export type UpdateProductTranslationBodyType = z.infer<typeof UpdateProductTranslationBodySchema>;

export type UpdateProductTranslationResType = z.infer<typeof UpdateProductTranslationResSchema>;

export type DeleteProductTranslationParamType = z.infer<typeof DeleteProductTranslationParamSchema>;
