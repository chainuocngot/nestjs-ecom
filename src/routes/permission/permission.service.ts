import { Injectable } from '@nestjs/common';
import { PermissionAlreadyExistsException, PermissionNotFoundException } from 'src/routes/permission/permission.error';
import {
  CreatePermissionBodyType,
  GetListPermissionQueryType,
  UpdatePermissionBodyType,
} from 'src/routes/permission/permission.model';
import { PermissionRepository } from 'src/routes/permission/permission.repository';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/utils';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  list(query: GetListPermissionQueryType) {
    return this.permissionRepository.getListPermission(query);
  }

  async findById(permissionId: number) {
    try {
      return await this.permissionRepository.findById(permissionId);
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw PermissionNotFoundException;
      }

      throw error;
    }
  }

  async create(createdById: number, body: CreatePermissionBodyType) {
    try {
      return await this.permissionRepository.create(createdById, body);
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw PermissionAlreadyExistsException;
      }

      throw error;
    }
  }

  async update({
    updatedById,
    body,
    permissionId,
  }: {
    updatedById: number;
    body: UpdatePermissionBodyType;
    permissionId: number;
  }) {
    try {
      return await this.permissionRepository.update({ updatedById, body, permissionId });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw PermissionAlreadyExistsException;
      }

      if (isNotFoundPrismaError(error)) {
        throw PermissionNotFoundException;
      }

      throw error;
    }
  }

  async delete(deletedById: number, permissionId: number) {
    try {
      await this.permissionRepository.delete(deletedById, permissionId);

      return {
        message: 'Xoá thành công',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw PermissionNotFoundException;
      }

      throw error;
    }
  }
}
