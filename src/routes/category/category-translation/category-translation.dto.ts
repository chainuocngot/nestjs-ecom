import { createZodDto } from 'nestjs-zod';
import {
  CategoryTranslationSchema,
  CreateCategoryTranslationBodySchema,
  CreateCategoryTranslationResSchema,
  DeleteCategoryTranslationParamSchema,
  GetCategoryTranslationDetailParamSchema,
  GetCategoryTranslationDetailResSchema,
  UpdateCategoryTranslationBodySchema,
  UpdateCategoryTranslationParamSchema,
  UpdateCategoryTranslationResSchema,
} from 'src/routes/category/category-translation/category-translation.model';

export class CategoryTranslationDto extends createZodDto(CategoryTranslationSchema) {}

export class GetCategoryTranslationDetailParamDto extends createZodDto(GetCategoryTranslationDetailParamSchema) {}

export class GetCategoryTranslationDetailResDto extends createZodDto(GetCategoryTranslationDetailResSchema) {}

export class CreateCategoryTranslationBodyDto extends createZodDto(CreateCategoryTranslationBodySchema) {}

export class CreateCategoryTranslationResDto extends createZodDto(CreateCategoryTranslationResSchema) {}

export class UpdateCategoryTranslationParamDto extends createZodDto(UpdateCategoryTranslationParamSchema) {}

export class UpdateCategoryTranslationBodyDto extends createZodDto(UpdateCategoryTranslationBodySchema) {}

export class UpdateCategoryTranslationResDto extends createZodDto(UpdateCategoryTranslationResSchema) {}

export class DeleteCategoryTranslationParamDto extends createZodDto(DeleteCategoryTranslationParamSchema) {}
