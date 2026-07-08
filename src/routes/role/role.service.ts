import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { ProhibitedActionOnBaseRoleException, RoleAlreadyExistsException } from 'src/routes/role/role.error';
import { CreateRoleBodyType, GetListRoleQueryType, UpdateRoleBodyType } from 'src/routes/role/role.model';
import { RoleRepository } from 'src/routes/role/role.repository';
import { RoleName } from 'src/shared/constants/role.constant';
import { RoleNotFoundException } from 'src/shared/error';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/utils';

@Injectable()
export class RoleService {
  private BASE_ROLE_NAMES: string[] = [RoleName.Admin, RoleName.Seller, RoleName.Client];

  constructor(
    private readonly roleRepository: RoleRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  list(query: GetListRoleQueryType) {
    return this.roleRepository.getListRole(query);
  }

  async findById(roleId: number) {
    try {
      return await this.roleRepository.findById(roleId);
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw RoleNotFoundException;
      }

      throw error;
    }
  }

  async create(createdById: number, body: CreateRoleBodyType) {
    try {
      return await this.roleRepository.create(createdById, body);
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw RoleAlreadyExistsException;
      }

      throw error;
    }
  }

  async update({ updatedById, body, roleId }: { updatedById: number; body: UpdateRoleBodyType; roleId: number }) {
    try {
      const role = await this.roleRepository.findById(roleId);
      if (!role) {
        throw RoleNotFoundException;
      }

      if (role.name === RoleName.Admin) {
        throw ProhibitedActionOnBaseRoleException;
      }

      const updatedRole = await this.roleRepository.update({
        updatedById,
        body,
        roleId,
      });

      await this.cacheManager.del(`role:${updatedRole.id}`);

      return updatedRole;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw RoleNotFoundException;
      }

      if (isUniqueConstraintPrismaError(error)) {
        throw RoleAlreadyExistsException;
      }

      throw error;
    }
  }

  async delete(deletedById: number, roleId: number) {
    try {
      const role = await this.roleRepository.findById(roleId);
      if (!role) {
        throw RoleNotFoundException;
      }

      if (this.BASE_ROLE_NAMES.includes(role.name)) {
        throw ProhibitedActionOnBaseRoleException;
      }

      const deletedRole = await this.roleRepository.delete(deletedById, roleId);
      await this.cacheManager.del(`role:${deletedRole.id}`);

      return {
        message: 'Xoá thành công',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw RoleNotFoundException;
      }

      throw error;
    }
  }
}
