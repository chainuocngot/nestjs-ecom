import { BrandTranslationSchema } from 'src/routes/brand/brand-translation/brand-translation.model';
import { PaginationQuerySchema } from 'src/shared/models/request.model';
import { z } from 'zod';

export const BrandSchema = z.object({
  id: z.number().int(),
  logo: z.string(),
  name: z.string(),
  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const BrandIncludeTranslationsSchema = BrandSchema.extend({
  brandTranslations: z.array(BrandTranslationSchema),
});

export const GetListBrandQuerySchema = PaginationQuerySchema;

export const GetListBrandResSchema = z.object({
  total: z.number().int(),
  records: z.array(BrandSchema),
});

export const GetBrandDetailParamSchema = z.object({
  brandId: z.coerce.number(),
});

export const GetBrandDetailResSchema = BrandIncludeTranslationsSchema;

export const CreateBrandBodySchema = BrandSchema.pick({
  logo: true,
  name: true,
}).strict();

export const CreateBrandResSchema = BrandSchema;

export const UpdateBrandParamSchema = GetBrandDetailParamSchema;

export const UpdateBrandBodySchema = CreateBrandBodySchema.partial();

export const UpdateBrandResSchema = BrandIncludeTranslationsSchema;

export const DeleteBrandParamSchema = GetBrandDetailParamSchema;

export type BrandType = z.infer<typeof BrandSchema>;

export type GetListBrandQueryType = z.infer<typeof GetListBrandQuerySchema>;

export type GetListBrandResType = z.infer<typeof GetListBrandResSchema>;

export type GetBrandDetailParamType = z.infer<typeof GetBrandDetailParamSchema>;

export type GetBrandDetailResType = z.infer<typeof GetBrandDetailResSchema>;

export type CreateBrandBodyType = z.infer<typeof CreateBrandBodySchema>;

export type CreateBrandResType = z.infer<typeof CreateBrandResSchema>;

export type UpdateBrandParamType = z.infer<typeof UpdateBrandParamSchema>;

export type UpdateBrandBodyType = z.infer<typeof UpdateBrandBodySchema>;

export type UpdateBrandResType = z.infer<typeof UpdateBrandResSchema>;

export type DeleteBrandParamType = z.infer<typeof DeleteBrandParamSchema>;
