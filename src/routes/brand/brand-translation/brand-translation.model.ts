import { z } from 'zod';

export const BrandTranslationSchema = z.object({
  id: z.number().int(),
  brandId: z.number().int(),
  languageId: z.string(),
  name: z.string(),
  description: z.string(),
  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetBrandTranslationDetailParamSchema = z.object({
  brandTranslationId: z.coerce.number(),
});

export const GetBrandTranslationDetailResSchema = BrandTranslationSchema;

export const CreateBrandTranslationBodySchema = BrandTranslationSchema.pick({
  brandId: true,
  languageId: true,
  name: true,
  description: true,
}).strict();

export const CreateBrandTranslationResSchema = BrandTranslationSchema;

export const UpdateBrandTranslationParamSchema = GetBrandTranslationDetailParamSchema;

export const UpdateBrandTranslationBodySchema = CreateBrandTranslationBodySchema.partial();

export const UpdateBrandTranslationResSchema = BrandTranslationSchema;

export const DeleteBrandTranslationParamSchema = GetBrandTranslationDetailParamSchema;

export type BrandTranslationType = z.infer<typeof BrandTranslationSchema>;

export type GetBrandTranslationDetailParamType = z.infer<typeof GetBrandTranslationDetailParamSchema>;

export type GetBrandTranslationDetailResType = z.infer<typeof GetBrandTranslationDetailResSchema>;

export type CreateBrandTranslationBodyType = z.infer<typeof CreateBrandTranslationBodySchema>;

export type CreateBrandTranslationResType = z.infer<typeof CreateBrandTranslationResSchema>;

export type UpdateBrandTranslationParamType = z.infer<typeof UpdateBrandTranslationParamSchema>;

export type UpdateBrandTranslationBodyType = z.infer<typeof UpdateBrandTranslationBodySchema>;

export type UpdateBrandTranslationResType = z.infer<typeof UpdateBrandTranslationResSchema>;

export type DeleteBrandTranslationParamType = z.infer<typeof DeleteBrandTranslationParamSchema>;
