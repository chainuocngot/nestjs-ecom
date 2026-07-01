import { ForbiddenException, Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { BrandNotFoundException } from 'src/routes/brand/brand.error';
import { CategoryNotFoundException } from 'src/routes/category/category.error';
import { ProductNotFoundException, ProductAlreadyExistsException } from 'src/routes/product/product.error';
import {
  CreateProductBodyType,
  GetListManageProductQueryType,
  UpdateProductBodyType,
} from 'src/routes/product/product.model';
import { ProductRepository } from 'src/routes/product/product.repository';
import { RoleName, RoleNameType } from 'src/shared/constants/role.constant';
import {
  isForeignKeyConstraintPrismaError,
  isNotFoundPrismaError,
  isUniqueConstraintPrismaError,
} from 'src/shared/utils';

@Injectable()
export class ManageProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  list({
    query,
    requestUserId,
    requestRoleName,
  }: {
    query: GetListManageProductQueryType;
    requestUserId: number;
    requestRoleName: RoleNameType;
  }) {
    this._validatePrivilege({
      requestRoleName,
      requestUserId,
      createdById: query.createdById,
    });
    return this.productRepository.getListProduct(query, I18nContext.current()?.lang as string);
  }

  async getDetailById({
    productId,
    requestRoleName,
    requestUserId,
  }: {
    productId: number;
    requestUserId: number;
    requestRoleName: RoleNameType;
  }) {
    const product = await this.productRepository.getDetailById({
      languageId: I18nContext.current()?.lang as string,
      productId,
    });

    if (!product) {
      throw ProductNotFoundException;
    }

    this._validatePrivilege({
      requestRoleName,
      requestUserId,
      createdById: product.createdById,
    });

    return product;
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
    requestRoleName,
  }: {
    updatedById: number;
    body: UpdateProductBodyType;
    productId: number;
    requestRoleName: RoleNameType;
  }) {
    try {
      const product = await this.productRepository.findById(productId);

      if (!product) {
        throw ProductNotFoundException;
      }

      this._validatePrivilege({
        requestRoleName,
        requestUserId: updatedById,
        createdById: product.createdById,
      });

      return await this.productRepository.update({
        body,
        productId,
        updatedById,
      });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw ProductAlreadyExistsException;
      }

      throw error;
    }
  }

  async delete({
    deletedById,
    productId,
    requestRoleName,
  }: {
    deletedById: number;
    productId: number;
    requestRoleName: RoleNameType;
  }) {
    try {
      const product = await this.productRepository.findById(productId);

      if (!product) {
        throw ProductNotFoundException;
      }

      this._validatePrivilege({
        requestRoleName,
        requestUserId: deletedById,
        createdById: product.createdById,
      });

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

  private _validatePrivilege({
    requestUserId,
    requestRoleName,
    createdById,
  }: {
    requestUserId: number;
    requestRoleName: RoleNameType;
    createdById: number | null;
  }) {
    if (requestUserId !== createdById && requestRoleName !== RoleName.Admin) {
      throw new ForbiddenException();
    }
    return true;
  }
}
