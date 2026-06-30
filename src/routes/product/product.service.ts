import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { BrandNotFoundException } from 'src/routes/brand/brand.error';
import { CategoryNotFoundException } from 'src/routes/category/category.error';
import {
  ProductNotFoundException,
  ProductAlreadyExistsException,
  ProductOrCategoryNotFoundException,
} from 'src/routes/product/product.error';
import {
  CreateProductBodyType,
  GetListProductQueryType,
  UpdateProductBodyType,
} from 'src/routes/product/product.model';
import { ProductRepository } from 'src/routes/product/product.repository';
import {
  isForeignKeyConstraintPrismaError,
  isNotFoundPrismaError,
  isUniqueConstraintPrismaError,
} from 'src/shared/utils';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  list(query: GetListProductQueryType) {
    return this.productRepository.getListProduct(query, I18nContext.current()?.lang as string);
  }

  async findById(productId: number) {
    try {
      return await this.productRepository.findById(productId, I18nContext.current()?.lang as string);
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw ProductNotFoundException;
      }

      throw error;
    }
  }

  async create(createdById: number, body: CreateProductBodyType) {
    try {
      return await this.productRepository.create({
        createdById,
        body,
        languageId: I18nContext.current()?.lang as string,
      });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw ProductAlreadyExistsException;
      }

      if (isForeignKeyConstraintPrismaError(error)) {
        throw BrandNotFoundException;
      }

      if (isNotFoundPrismaError(error)) {
        throw CategoryNotFoundException;
      }

      throw error;
    }
  }

  async update({
    body,
    productId,
    updatedById,
  }: {
    updatedById: number;
    body: UpdateProductBodyType;
    productId: number;
  }) {
    try {
      return await this.productRepository.update({
        body,
        productId,
        updatedById,
      });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw ProductAlreadyExistsException;
      }

      if (isNotFoundPrismaError(error)) {
        throw ProductOrCategoryNotFoundException;
      }

      throw error;
    }
  }

  async delete(deletedById: number, productId: number) {
    try {
      await this.productRepository.delete(deletedById, productId);

      return {
        message: 'Xoá thành công',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw ProductNotFoundException;
      }

      throw error;
    }
  }
}
