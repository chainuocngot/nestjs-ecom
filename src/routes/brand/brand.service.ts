import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { BrandAlreadyExistsException, BrandNotFoundException } from 'src/routes/brand/brand.error';
import { CreateBrandBodyType, GetListBrandQueryType, UpdateBrandBodyType } from 'src/routes/brand/brand.model';
import { BrandRepository } from 'src/routes/brand/brand.repository';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/utils';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  list(query: GetListBrandQueryType) {
    return this.brandRepository.getListBrand(query, I18nContext.current()?.lang as string);
  }

  async findById(brandId: number) {
    try {
      return await this.brandRepository.findById(brandId, I18nContext.current()?.lang as string);
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw BrandNotFoundException;
      }

      throw error;
    }
  }

  async create(createdById: number, body: CreateBrandBodyType) {
    try {
      return await this.brandRepository.create(createdById, body);
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw BrandAlreadyExistsException;
      }

      throw error;
    }
  }

  async update({ updatedById, body, brandId }: { updatedById: number; body: UpdateBrandBodyType; brandId: number }) {
    try {
      return await this.brandRepository.update({
        updatedById,
        body,
        brandId,
        languageId: I18nContext.current()?.lang as string,
      });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw BrandAlreadyExistsException;
      }

      if (isNotFoundPrismaError(error)) {
        throw BrandNotFoundException;
      }

      throw error;
    }
  }

  async delete(deletedById: number, brandId: number) {
    try {
      await this.brandRepository.delete(deletedById, brandId);

      return {
        message: 'Xoá thành công',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw BrandNotFoundException;
      }

      throw error;
    }
  }
}
