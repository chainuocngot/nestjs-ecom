import { createZodDto } from 'nestjs-zod';
import {
  CategorySchema,
  CreateCategoryBodySchema,
  CreateCategoryResSchema,
  DeleteCategoryParamSchema,
  GetCategoryDetailParamSchema,
  GetCategoryDetailResSchema,
  GetListCategoryQuerySchema,
  GetListCategoryResSchema,
  UpdateCategoryBodySchema,
  UpdateCategoryParamSchema,
  UpdateCategoryResSchema,
} from 'src/routes/category/category.model';

export class CategoryDto extends createZodDto(CategorySchema) {}

export class GetListCategoryQueryDto extends createZodDto(GetListCategoryQuerySchema) {}

export class GetListCategoryResDto extends createZodDto(GetListCategoryResSchema) {}

export class GetCategoryDetailParamDto extends createZodDto(GetCategoryDetailParamSchema) {}

export class GetCategoryDetailResDto extends createZodDto(GetCategoryDetailResSchema) {}

export class CreateCategoryBodyDto extends createZodDto(CreateCategoryBodySchema) {}

export class CreateCategoryResDto extends createZodDto(CreateCategoryResSchema) {}

export class UpdateCategoryParamDto extends createZodDto(UpdateCategoryParamSchema) {}

export class UpdateCategoryBodyDto extends createZodDto(UpdateCategoryBodySchema) {}

export class UpdateCategoryResDto extends createZodDto(UpdateCategoryResSchema) {}

export class DeleteCategoryParamDto extends createZodDto(DeleteCategoryParamSchema) {}
