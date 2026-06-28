import { createZodDto } from 'nestjs-zod';
import {
  BrandTranslationSchema,
  CreateBrandTranslationBodySchema,
  CreateBrandTranslationResSchema,
  DeleteBrandTranslationParamSchema,
  GetBrandTranslationDetailParamSchema,
  GetBrandTranslationDetailResSchema,
  UpdateBrandTranslationBodySchema,
  UpdateBrandTranslationParamSchema,
  UpdateBrandTranslationResSchema,
} from 'src/routes/brand/brand-translation/brand-translation.model';

export class BrandTranslationDto extends createZodDto(BrandTranslationSchema) {}

export class GetBrandTranslationDetailParamDto extends createZodDto(GetBrandTranslationDetailParamSchema) {}

export class GetBrandTranslationDetailResDto extends createZodDto(GetBrandTranslationDetailResSchema) {}

export class CreateBrandTranslationBodyDto extends createZodDto(CreateBrandTranslationBodySchema) {}

export class CreateBrandTranslationResDto extends createZodDto(CreateBrandTranslationResSchema) {}

export class UpdateBrandTranslationParamDto extends createZodDto(UpdateBrandTranslationParamSchema) {}

export class UpdateBrandTranslationBodyDto extends createZodDto(UpdateBrandTranslationBodySchema) {}

export class UpdateBrandTranslationResDto extends createZodDto(UpdateBrandTranslationResSchema) {}

export class DeleteBrandTranslationParamDto extends createZodDto(DeleteBrandTranslationParamSchema) {}
