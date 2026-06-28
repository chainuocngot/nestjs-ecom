import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { CategoryAlreadyExistsException, CategoryNotFoundException } from 'src/routes/category/category.error';
import {
  CreateCategoryBodyType,
  GetListCategoryQueryType,
  UpdateCategoryBodyType,
} from 'src/routes/category/category.model';
import { CategoryRepository } from 'src/routes/category/category.repository';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/utils';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  list(query: GetListCategoryQueryType) {
    return this.categoryRepository.getListCategory(query, I18nContext.current()?.lang as string);
  }

  async findById(categoryId: number) {
    try {
      return await this.categoryRepository.findById(categoryId, I18nContext.current()?.lang as string);
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw CategoryNotFoundException;
      }

      throw error;
    }
  }

  async create(createdById: number, body: CreateCategoryBodyType) {
    try {
      return await this.categoryRepository.create(createdById, body);
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw CategoryAlreadyExistsException;
      }

      throw error;
    }
  }

  async update({
    updatedById,
    body,
    categoryId,
  }: {
    updatedById: number;
    body: UpdateCategoryBodyType;
    categoryId: number;
  }) {
    try {
      return await this.categoryRepository.update({
        updatedById,
        body,
        categoryId,
        languageId: I18nContext.current()?.lang as string,
      });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw CategoryAlreadyExistsException;
      }

      if (isNotFoundPrismaError(error)) {
        throw CategoryNotFoundException;
      }

      throw error;
    }
  }

  async delete(deletedById: number, categoryId: number) {
    try {
      await this.categoryRepository.delete(deletedById, categoryId);

      return {
        message: 'Xoá thành công',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw CategoryNotFoundException;
      }

      throw error;
    }
  }
}
