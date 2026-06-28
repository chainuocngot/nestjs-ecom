import { z } from 'zod';

export const CategoryTranslationSchema = z.object({
  id: z.number().int(),
  categoryId: z.number().int(),
  languageId: z.string(),
  name: z.string(),
  description: z.string(),
  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetCategoryTranslationDetailParamSchema = z.object({
  categoryTranslationId: z.coerce.number(),
});

export const GetCategoryTranslationDetailResSchema = CategoryTranslationSchema;

export const CreateCategoryTranslationBodySchema = CategoryTranslationSchema.pick({
  categoryId: true,
  languageId: true,
  name: true,
  description: true,
}).strict();

export const CreateCategoryTranslationResSchema = CategoryTranslationSchema;

export const UpdateCategoryTranslationParamSchema = GetCategoryTranslationDetailParamSchema;

export const UpdateCategoryTranslationBodySchema = CreateCategoryTranslationBodySchema.partial();

export const UpdateCategoryTranslationResSchema = CategoryTranslationSchema;

export const DeleteCategoryTranslationParamSchema = GetCategoryTranslationDetailParamSchema;

export type CategoryTranslationType = z.infer<typeof CategoryTranslationSchema>;

export type GetCategoryTranslationDetailParamType = z.infer<typeof GetCategoryTranslationDetailParamSchema>;

export type GetCategoryTranslationDetailResType = z.infer<typeof GetCategoryTranslationDetailResSchema>;

export type CreateCategoryTranslationBodyType = z.infer<typeof CreateCategoryTranslationBodySchema>;

export type CreateCategoryTranslationResType = z.infer<typeof CreateCategoryTranslationResSchema>;

export type UpdateCategoryTranslationParamType = z.infer<typeof UpdateCategoryTranslationParamSchema>;

export type UpdateCategoryTranslationBodyType = z.infer<typeof UpdateCategoryTranslationBodySchema>;

export type UpdateCategoryTranslationResType = z.infer<typeof UpdateCategoryTranslationResSchema>;

export type DeleteCategoryTranslationParamType = z.infer<typeof DeleteCategoryTranslationParamSchema>;
