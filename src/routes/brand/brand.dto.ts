import { createZodDto } from 'nestjs-zod';
import {
  BrandSchema,
  CreateBrandBodySchema,
  CreateBrandResSchema,
  DeleteBrandParamSchema,
  GetBrandDetailParamSchema,
  GetBrandDetailResSchema,
  GetListBrandQuerySchema,
  GetListBrandResSchema,
  UpdateBrandBodySchema,
  UpdateBrandParamSchema,
  UpdateBrandResSchema,
} from 'src/routes/brand/brand.model';

export class BrandDto extends createZodDto(BrandSchema) {}

export class GetListBrandQueryDto extends createZodDto(GetListBrandQuerySchema) {}

export class GetListBrandResDto extends createZodDto(GetListBrandResSchema) {}

export class GetBrandDetailParamDto extends createZodDto(GetBrandDetailParamSchema) {}

export class GetBrandDetailResDto extends createZodDto(GetBrandDetailResSchema) {}

export class CreateBrandBodyDto extends createZodDto(CreateBrandBodySchema) {}

export class CreateBrandResDto extends createZodDto(CreateBrandResSchema) {}

export class UpdateBrandParamDto extends createZodDto(UpdateBrandParamSchema) {}

export class UpdateBrandBodyDto extends createZodDto(UpdateBrandBodySchema) {}

export class UpdateBrandResDto extends createZodDto(UpdateBrandResSchema) {}

export class DeleteBrandParamDto extends createZodDto(DeleteBrandParamSchema) {}
