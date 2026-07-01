import { createZodDto } from 'nestjs-zod';
import {
  CreateProductBodySchema,
  CreateProductResSchema,
  GetListManageProductQuerySchema,
  GetListProductQuerySchema,
  GetListProductResSchema,
  GetProductDetailParamSchema,
  GetProductDetailResSchema,
  ProductSchema,
  SingleVariantSchema,
  UpdateProductBodySchema,
  UpdateProductResSchema,
  VariantsSchema,
} from 'src/routes/product/product.model';

export class SingleVariantDto extends createZodDto(SingleVariantSchema) {}

export class VariantsDto extends createZodDto(VariantsSchema) {}

export class ProductDto extends createZodDto(ProductSchema) {}

export class GetListProductQueryDto extends createZodDto(GetListProductQuerySchema) {}

export class GetListManageProductQueryDto extends createZodDto(GetListManageProductQuerySchema) {}

export class GetListProductResDto extends createZodDto(GetListProductResSchema) {}

export class GetProductDetailParamDto extends createZodDto(GetProductDetailParamSchema) {}

export class GetProductDetailResDto extends createZodDto(GetProductDetailResSchema) {}

export class CreateProductBodyDto extends createZodDto(CreateProductBodySchema) {}

export class CreateProductResDto extends createZodDto(CreateProductResSchema) {}

export class UpdateProductBodyDto extends createZodDto(UpdateProductBodySchema) {}

export class UpdateProductResDto extends createZodDto(UpdateProductResSchema) {}
