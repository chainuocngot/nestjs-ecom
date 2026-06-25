import { createZodDto } from 'nestjs-zod';
import {
  CreateLanguageBodySchema,
  CreateLanguageResSchema,
  DeleteLanguageParamSchema,
  GetLanguageDetailParamSchema,
  GetLanguageDetailResSchema,
  GetListLanguageResSchema,
  LanguageSchema,
  UpdateLanguageBodySchema,
  UpdateLanguageParamSchema,
  UpdateLanguageResSchema,
} from 'src/routes/language/language.model';

export class LanguageDto extends createZodDto(LanguageSchema) {}

export class GetListLanguageResDto extends createZodDto(GetListLanguageResSchema) {}

export class GetLanguageDetailParamDto extends createZodDto(GetLanguageDetailParamSchema) {}

export class GetLanguageDetailResDto extends createZodDto(GetLanguageDetailResSchema) {}

export class CreateLanguageBodyDto extends createZodDto(CreateLanguageBodySchema) {}

export class CreateLanguageResDto extends createZodDto(CreateLanguageResSchema) {}

export class UpdateLanguageParamDto extends createZodDto(UpdateLanguageParamSchema) {}

export class UpdateLanguageBodyDto extends createZodDto(UpdateLanguageBodySchema) {}

export class UpdateLanguageResDto extends createZodDto(UpdateLanguageResSchema) {}

export class DeleteLanguageParamDto extends createZodDto(DeleteLanguageParamSchema) {}
