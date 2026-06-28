import { Injectable } from '@nestjs/common';
import {
  BrandOrLanguageNotFoundException,
  BrandTranslationAlreadyExistsException,
  BrandTranslationNotFoundException,
} from 'src/routes/brand/brand-translation/brand-translation.error';
import {
  CreateBrandTranslationBodyType,
  UpdateBrandTranslationBodyType,
} from 'src/routes/brand/brand-translation/brand-translation.model';
import { BrandTranslationRepository } from 'src/routes/brand/brand-translation/brand-translation.repository';
import {
  isForeignKeyConstraintPrismaError,
  isNotFoundPrismaError,
  isUniqueConstraintPrismaError,
} from 'src/shared/utils';

@Injectable()
export class BrandTranslationService {
  constructor(private readonly brandTranslationRepository: BrandTranslationRepository) {}

  async findById(brandTranslationId: number) {
    try {
      return await this.brandTranslationRepository.findById(brandTranslationId);
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw BrandTranslationNotFoundException;
      }

      throw error;
    }
  }

  async create(createdById: number, body: CreateBrandTranslationBodyType) {
    try {
      return await this.brandTranslationRepository.create(createdById, body);
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw BrandTranslationAlreadyExistsException;
      }

      if (isForeignKeyConstraintPrismaError(error)) {
        throw BrandOrLanguageNotFoundException;
      }

      throw error;
    }
  }

  async update({
    updatedById,
    body,
    brandTranslationId,
  }: {
    updatedById: number;
    body: UpdateBrandTranslationBodyType;
    brandTranslationId: number;
  }) {
    try {
      return await this.brandTranslationRepository.update({ updatedById, body, brandTranslationId });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw BrandTranslationAlreadyExistsException;
      }

      if (isNotFoundPrismaError(error)) {
        throw BrandTranslationNotFoundException;
      }

      if (isForeignKeyConstraintPrismaError(error)) {
        throw BrandOrLanguageNotFoundException;
      }

      throw error;
    }
  }

  async delete(deletedById: number, brandTranslationId: number) {
    try {
      await this.brandTranslationRepository.delete(deletedById, brandTranslationId);

      return {
        message: 'Xoá thành công',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw BrandTranslationNotFoundException;
      }

      throw error;
    }
  }
}
