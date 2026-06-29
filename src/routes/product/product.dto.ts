import { createZodDto } from 'nestjs-zod';
import {
  CreateProductBodySchema,
  GetListProductQuerySchema,
  GetListProductResSchema,
  GetProductDetailParamSchema,
  GetProductDetailResSchema,
  ProductSchema,
  SingleVariantSchema,
  UpdateProductBodySchema,
  VariantsSchema,
} from 'src/routes/product/product.model';

export class SingleVariantDto extends createZodDto(SingleVariantSchema) {}

export class VariantsDto extends createZodDto(VariantsSchema) {}

export class ProductDto extends createZodDto(ProductSchema) {}

export class GetListProductQueryDto extends createZodDto(GetListProductQuerySchema) {}

export class GetListProductResDto extends createZodDto(GetListProductResSchema) {}

export class GetProductDetailParamDto extends createZodDto(GetProductDetailParamSchema) {}

export class GetProductDetailResDto extends createZodDto(GetProductDetailResSchema) {}

export class CreateProductBodyDto extends createZodDto(CreateProductBodySchema) {}

export class UpdateProductBodyDto extends createZodDto(UpdateProductBodySchema) {}
