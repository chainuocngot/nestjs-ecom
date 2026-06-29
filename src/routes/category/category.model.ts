import { CategoryTranslationSchema } from 'src/routes/category/category-translation/category-translation.model';
import { PaginationQuerySchema } from 'src/shared/models/request.model';
import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  logo: z.string().nullable(),
  parentCategoryId: z.number().int().nullable(),
  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CategoryIncludeTranslationsSchema = CategorySchema.extend({
  categoryTranslations: z.array(CategoryTranslationSchema),
});

export const GetListCategoryQuerySchema = PaginationQuerySchema;

export const GetListCategoryResSchema = z.object({
  total: z.number().int(),
  records: z.array(CategorySchema),
});

export const GetCategoryDetailParamSchema = z.object({
  categoryId: z.coerce.number(),
});

export const GetCategoryDetailResSchema = CategoryIncludeTranslationsSchema;

export const CreateCategoryBodySchema = CategorySchema.pick({
  logo: true,
  name: true,
  parentCategoryId: true,
})
  .required()
  .extend({
    parentCategoryId: CategorySchema.shape.parentCategoryId.optional(),
  });

export const CreateCategoryResSchema = CategorySchema;

export const UpdateCategoryParamSchema = GetCategoryDetailParamSchema;

export const UpdateCategoryBodySchema = CreateCategoryBodySchema.partial();

export const UpdateCategoryResSchema = CategoryIncludeTranslationsSchema;

export const DeleteCategoryParamSchema = GetCategoryDetailParamSchema;

export type CategoryType = z.infer<typeof CategorySchema>;

export type GetListCategoryQueryType = z.infer<typeof GetListCategoryQuerySchema>;

export type GetListCategoryResType = z.infer<typeof GetListCategoryResSchema>;

export type GetCategoryDetailParamType = z.infer<typeof GetCategoryDetailParamSchema>;

export type GetCategoryDetailResType = z.infer<typeof GetCategoryDetailResSchema>;

export type CreateCategoryBodyType = z.infer<typeof CreateCategoryBodySchema>;

export type CreateCategoryResType = z.infer<typeof CreateCategoryResSchema>;

export type UpdateCategoryParamType = z.infer<typeof UpdateCategoryParamSchema>;

export type UpdateCategoryBodyType = z.infer<typeof UpdateCategoryBodySchema>;

export type UpdateCategoryResType = z.infer<typeof UpdateCategoryResSchema>;

export type DeleteCategoryParamType = z.infer<typeof DeleteCategoryParamSchema>;
