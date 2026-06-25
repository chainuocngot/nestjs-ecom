import { z } from 'zod';

export const LanguageSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  deletedById: z.number().int().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetListLanguageResSchema = z.object({
  total: z.number().int(),
  records: z.array(LanguageSchema),
});

export const GetLanguageDetailParamSchema = z.object({
  languageId: z.string(),
});

export const GetLanguageDetailResSchema = LanguageSchema;

export const CreateLanguageBodySchema = LanguageSchema.pick({
  id: true,
  name: true,
}).strict();

export const CreateLanguageResSchema = LanguageSchema;

export const UpdateLanguageParamSchema = GetLanguageDetailParamSchema;

export const UpdateLanguageBodySchema = CreateLanguageBodySchema;

export const UpdateLanguageResSchema = LanguageSchema;

export const DeleteLanguageParamSchema = GetLanguageDetailParamSchema;

export type LanguageType = z.infer<typeof LanguageSchema>;

export type GetListLanguageResType = z.infer<typeof GetListLanguageResSchema>;

export type GetLanguageDetailParamType = z.infer<typeof GetLanguageDetailParamSchema>;

export type GetLanguageDetailResType = z.infer<typeof GetLanguageDetailResSchema>;

export type CreateLanguageBodyType = z.infer<typeof CreateLanguageBodySchema>;

export type CreateLanguageResType = z.infer<typeof CreateLanguageResSchema>;

export type UpdateLanguageParamType = z.infer<typeof UpdateLanguageParamSchema>;

export type UpdateLanguageBodyType = z.infer<typeof UpdateLanguageBodySchema>;

export type UpdateLanguageResType = z.infer<typeof UpdateLanguageResSchema>;

export type DeleteLanguageParamType = z.infer<typeof DeleteLanguageParamSchema>;
