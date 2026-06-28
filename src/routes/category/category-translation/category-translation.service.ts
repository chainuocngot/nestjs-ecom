import { Injectable } from '@nestjs/common';
import {
  CategoryOrLanguageNotFoundException,
  CategoryTranslationAlreadyExistsException,
  CategoryTranslationNotFoundException,
} from 'src/routes/category/category-translation/category-translation.error';
import {
  CreateCategoryTranslationBodyType,
  UpdateCategoryTranslationBodyType,
} from 'src/routes/category/category-translation/category-translation.model';
import { CategoryTranslationRepository } from 'src/routes/category/category-translation/category-translation.repository';
import {
  isForeignKeyConstraintPrismaError,
  isNotFoundPrismaError,
  isUniqueConstraintPrismaError,
} from 'src/shared/utils';

@Injectable()
export class CategoryTranslationService {
  constructor(private readonly categoryTranslationRepository: CategoryTranslationRepository) {}

  async findById(categoryTranslationId: number) {
    try {
      return await this.categoryTranslationRepository.findById(categoryTranslationId);
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw CategoryTranslationNotFoundException;
      }

      throw error;
    }
  }

  async create(createdById: number, body: CreateCategoryTranslationBodyType) {
    try {
      return await this.categoryTranslationRepository.create(createdById, body);
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw CategoryTranslationAlreadyExistsException;
      }

      if (isForeignKeyConstraintPrismaError(error)) {
        throw CategoryOrLanguageNotFoundException;
      }

      throw error;
    }
  }

  async update({
    updatedById,
    body,
    categoryTranslationId,
  }: {
    updatedById: number;
    body: UpdateCategoryTranslationBodyType;
    categoryTranslationId: number;
  }) {
    try {
      return await this.categoryTranslationRepository.update({ updatedById, body, categoryTranslationId });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw CategoryTranslationAlreadyExistsException;
      }

      if (isNotFoundPrismaError(error)) {
        throw CategoryTranslationNotFoundException;
      }

      if (isForeignKeyConstraintPrismaError(error)) {
        throw CategoryOrLanguageNotFoundException;
      }

      throw error;
    }
  }

  async delete(deletedById: number, categoryTranslationId: number) {
    try {
      await this.categoryTranslationRepository.delete(deletedById, categoryTranslationId);

      return {
        message: 'Xoá thành công',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw CategoryTranslationNotFoundException;
      }

      throw error;
    }
  }
}
