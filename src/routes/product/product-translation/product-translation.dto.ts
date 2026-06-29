import { createZodDto } from 'nestjs-zod';
import {
  ProductTranslationSchema,
  GetProductTranslationDetailParamSchema,
  GetProductTranslationDetailResSchema,
  CreateProductTranslationBodySchema,
  CreateProductTranslationResSchema,
  UpdateProductTranslationParamSchema,
  UpdateProductTranslationBodySchema,
  UpdateProductTranslationResSchema,
  DeleteProductTranslationParamSchema,
} from 'src/routes/product/product-translation/product-translation.model';

export class ProductTranslationDto extends createZodDto(ProductTranslationSchema) {}

export class GetProductTranslationDetailParamDto extends createZodDto(GetProductTranslationDetailParamSchema) {}

export class GetProductTranslationDetailResDto extends createZodDto(GetProductTranslationDetailResSchema) {}

export class CreateProductTranslationBodyDto extends createZodDto(CreateProductTranslationBodySchema) {}

export class CreateProductTranslationResDto extends createZodDto(CreateProductTranslationResSchema) {}

export class UpdateProductTranslationParamDto extends createZodDto(UpdateProductTranslationParamSchema) {}

export class UpdateProductTranslationBodyDto extends createZodDto(UpdateProductTranslationBodySchema) {}

export class UpdateProductTranslationResDto extends createZodDto(UpdateProductTranslationResSchema) {}

export class DeleteProductTranslationParamDto extends createZodDto(DeleteProductTranslationParamSchema) {}
