import { Injectable } from '@nestjs/common';
import {
  ProductTranslationNotFoundException,
  ProductTranslationAlreadyExistsException,
  ProductOrLanguageNotFoundException,
} from 'src/routes/product/product-translation/product-translation.error';
import {
  CreateProductTranslationBodyType,
  UpdateProductTranslationBodyType,
} from 'src/routes/product/product-translation/product-translation.model';
import { ProductTranslationRepository } from 'src/routes/product/product-translation/product-translation.repository';
import {
  isNotFoundPrismaError,
  isUniqueConstraintPrismaError,
  isForeignKeyConstraintPrismaError,
} from 'src/shared/utils';

@Injectable()
export class ProductTranslationService {
  constructor(private readonly productTranslationRepository: ProductTranslationRepository) {}

  async findById(productTranslationId: number) {
    try {
      return await this.productTranslationRepository.findById(productTranslationId);
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw ProductTranslationNotFoundException;
      }

      throw error;
    }
  }

  async create(createdById: number, body: CreateProductTranslationBodyType) {
    try {
      return await this.productTranslationRepository.create(createdById, body);
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw ProductTranslationAlreadyExistsException;
      }

      if (isForeignKeyConstraintPrismaError(error)) {
        throw ProductOrLanguageNotFoundException;
      }

      throw error;
    }
  }

  async update({
    body,
    productTranslationId,
    updatedById,
  }: {
    updatedById: number;
    body: UpdateProductTranslationBodyType;
    productTranslationId: number;
  }) {
    try {
      return await this.productTranslationRepository.update({
        body,
        productTranslationId,
        updatedById,
      });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw ProductTranslationAlreadyExistsException;
      }

      if (isNotFoundPrismaError(error)) {
        throw ProductTranslationNotFoundException;
      }

      if (isForeignKeyConstraintPrismaError(error)) {
        throw ProductOrLanguageNotFoundException;
      }

      throw error;
    }
  }

  async delete(deletedById: number, productTranslationId: number) {
    try {
      await this.productTranslationRepository.delete(deletedById, productTranslationId);

      return {
        message: 'Xoá thành công',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw ProductTranslationNotFoundException;
      }

      throw error;
    }
  }
}
