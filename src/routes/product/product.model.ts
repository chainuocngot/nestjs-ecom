import { BrandIncludeTranslationsSchema } from 'src/routes/brand/brand.model';
import { CategoryIncludeTranslationsSchema } from 'src/routes/category/category.model';
import { ProductTranslationSchema } from 'src/routes/product/product-translation/product-translation.model';
import { SkuSchema, UpsertSkuBodySchema } from 'src/routes/product/sku.model';
import { PaginationQuerySchema } from 'src/shared/models/request.model';
import { generateSkus } from 'src/shared/utils';
import { z } from 'zod';

export const SingleVariantSchema = z.object({
  value: z.string(),
  options: z.array(z.string()),
});

export const VariantsSchema = z.array(SingleVariantSchema).superRefine((variants, ctx) => {
  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];
    const isExistingVariant = variants.findIndex((v) => v.value === variant.value) !== i;
    if (isExistingVariant) {
      return ctx.addIssue({
        code: 'custom',
        message: `Giá trị ${variant.value} đã tồn tại.`,
        path: ['variants'],
      });
    }

    const isDifferentOption = variant.options.some((option, index) => {
      const isExistingOption = variant.options.findIndex((o) => o.toLowerCase() === option.toLowerCase()) !== index;
      return isExistingOption;
    });

    if (isDifferentOption) {
      return ctx.addIssue({
        code: 'custom',
        message: `Variant ${variant.value} chứa các option trùng tên với nhau.`,
        path: ['variants'],
      });
    }
  }
});

export const ProductSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  basePrice: z.number(),
  virtualPrice: z.number(),
  publishedAt: z.coerce.date().nullable(),
  brandId: z.number().int(),
  images: z.array(z.string()),
  variants: VariantsSchema,
  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  deletedById: z.number().int().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetListProductQuerySchema = PaginationQuerySchema.extend({
  name: z.string().optional(),
  brandIds: z.array(z.coerce.number().int()).optional(),
  categoryIds: z.array(z.coerce.number().int()).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

export const GetListProductResSchema = z.object({
  total: z.number().int(),
  records: z.array(
    ProductSchema.extend({
      productTranslations: z.array(ProductTranslationSchema),
    }),
  ),
});

export const GetProductDetailParamSchema = z
  .object({
    productId: z.coerce.number().int(),
  })
  .strict();

export const GetProductDetailResSchema = z.object({
  productTranslations: z.array(ProductTranslationSchema),
  skus: z.array(SkuSchema),
  categories: z.array(CategoryIncludeTranslationsSchema),
  brand: BrandIncludeTranslationsSchema,
});

export const CreateProductBodySchema = ProductSchema.pick({
  publishedAt: true,
  name: true,
  basePrice: true,
  virtualPrice: true,
  brandId: true,
  images: true,
  variants: true,
})
  .extend({
    categories: z.array(z.coerce.number().int()),
    skus: z.array(UpsertSkuBodySchema),
  })
  .strict()
  .superRefine(({ variants, skus }, ctx) => {
    const skuValueArray = generateSkus(variants);
    if (skus.length !== skuValueArray.length) {
      return ctx.addIssue({
        code: 'custom',
        path: ['skus'],
        message: `Số lượng SKU nên là ${skuValueArray.length}`,
      });
    }

    let wrongSkuIndex = -1;
    const isValidSkus = skus.every((sku, index) => {
      const isValid = sku.value === skuValueArray[index].value;
      if (!isValid) {
        wrongSkuIndex = index;
      }

      return isValid;
    });

    if (!isValidSkus) {
      return ctx.addIssue({
        code: 'custom',
        path: ['skus'],
        message: `Giá trị SKU index ${wrongSkuIndex} không hợp lệ`,
      });
    }
  });

export const CreateProductResSchema = GetProductDetailResSchema;

export const UpdateProductBodySchema = CreateProductBodySchema;

export const UpdateProductResSchema = ProductSchema;

export type SingleVariantType = z.infer<typeof SingleVariantSchema>;

export type VariantsType = z.infer<typeof VariantsSchema>;

export type ProductType = z.infer<typeof ProductSchema>;

export type GetListProductQueryType = z.infer<typeof GetListProductQuerySchema>;

export type GetListProductResType = z.infer<typeof GetListProductResSchema>;

export type GetProductDetailParamType = z.infer<typeof GetProductDetailParamSchema>;

export type GetProductDetailResType = z.infer<typeof GetProductDetailResSchema>;

export type CreateProductBodyType = z.infer<typeof CreateProductBodySchema>;

export type CreateProductResType = z.infer<typeof CreateProductResSchema>;

export type UpdateProductBodyType = z.infer<typeof UpdateProductBodySchema>;

export type UpdateProductResType = z.infer<typeof UpdateProductResSchema>;
