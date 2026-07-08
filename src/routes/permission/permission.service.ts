import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { PermissionAlreadyExistsException, PermissionNotFoundException } from 'src/routes/permission/permission.error';
import {
  CreatePermissionBodyType,
  GetListPermissionQueryType,
  UpdatePermissionBodyType,
} from 'src/routes/permission/permission.model';
import { PermissionRepository } from 'src/routes/permission/permission.repository';
import { RoleType } from 'src/shared/models/shared-user.model';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/utils';

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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
      const permission = await this.permissionRepository.update({ updatedById, body, permissionId });

      const { roles } = permission;
      await this._deletedCachedRole(roles);

      return permission;
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
      const permission = await this.permissionRepository.delete(deletedById, permissionId);
      const { roles } = permission;
      await this._deletedCachedRole(roles);

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

  _deletedCachedRole(roles: RoleType[]) {
    return Promise.all(
      roles.map((role) => {
        const cachedKey = `role:${role.id}`;
        return this.cacheManager.del(cachedKey);
      }),
    );
  }
}
