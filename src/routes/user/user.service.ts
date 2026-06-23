import { ForbiddenException, Injectable } from '@nestjs/common';
import { CannotUpdateOrDeleteYourselfException, UserAlreadyExistsException } from 'src/routes/user/user.error';
import { CreateUserBodyType, GetListUserQueryType, UpdateUserBodyType } from 'src/routes/user/user.model';
import { UserRepository } from 'src/routes/user/user.repository';
import { RoleName, RoleNameType } from 'src/shared/constants/role.constant';
import { RoleNotFoundException, UserNotFoundException } from 'src/shared/error';
import { SharedRoleRepository } from 'src/shared/repositories/shared-role.repository';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repository';
import { HashingService } from 'src/shared/services/hashing.service';
import {
  isForeignKeyConstraintPrismaError,
  isNotFoundPrismaError,
  isUniqueConstraintPrismaError,
} from 'src/shared/utils';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
    private readonly sharedRoleRepository: SharedRoleRepository,
    private readonly sharedUserRepository: SharedUserRepository,
  ) {}

  list(query: GetListUserQueryType) {
    return this.userRepository.getListUser(query);
  }

  async findById(userId: number) {
    try {
      return await this.userRepository.findById(userId);
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw UserNotFoundException;
      }

      throw error;
    }
  }

  async create({
    createdById,
    body,
    authorRoleName,
  }: {
    createdById: number;
    body: CreateUserBodyType;
    authorRoleName: RoleNameType;
  }) {
    try {
      await this._verifyRoleAuthor({
        authorRoleName,
        targetRoleId: body.roleId,
      });

      const hashedPassword = await this.hashingService.hash(body.password);
      return await this.userRepository.create(createdById, { ...body, password: hashedPassword });
    } catch (error) {
      if (isForeignKeyConstraintPrismaError(error)) {
        throw RoleNotFoundException;
      }

      if (isUniqueConstraintPrismaError(error)) {
        throw UserAlreadyExistsException;
      }

      throw error;
    }
  }

  async update({
    updatedById,
    body,
    userId,
    authorRoleName,
  }: {
    updatedById: number;
    body: UpdateUserBodyType;
    userId: number;
    authorRoleName: RoleNameType;
  }) {
    try {
      this._verifyYourself({
        authorUserId: updatedById,
        targetUserId: userId,
      });

      const targetRoleId = await this._getRoleIdByUserId(userId);
      await this._verifyRoleAuthor({
        authorRoleName,
        targetRoleId,
      });

      return await this.userRepository.update({ updatedById, body, userId });
    } catch (error) {
      if (isForeignKeyConstraintPrismaError(error)) {
        throw RoleNotFoundException;
      }

      if (isNotFoundPrismaError(error)) {
        throw UserNotFoundException;
      }

      if (isUniqueConstraintPrismaError(error)) {
        throw UserAlreadyExistsException;
      }

      throw error;
    }
  }

  async delete({
    deletedById,
    userId,
    authorRoleName,
  }: {
    deletedById: number;
    userId: number;
    authorRoleName: RoleNameType;
  }) {
    try {
      this._verifyYourself({
        authorUserId: deletedById,
        targetUserId: userId,
      });

      const targetRoleId = await this._getRoleIdByUserId(userId);
      await this._verifyRoleAuthor({
        authorRoleName,
        targetRoleId,
      });

      await this.userRepository.delete({ deletedById, userId });

      return {
        message: 'Xoá thành công',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw UserNotFoundException;
      }

      throw error;
    }
  }

  _verifyYourself({ authorUserId, targetUserId }: { authorUserId: number; targetUserId: number }) {
    if (authorUserId === targetUserId) {
      throw CannotUpdateOrDeleteYourselfException;
    }

    return true;
  }

  async _verifyRoleAuthor({ authorRoleName, targetRoleId }: { authorRoleName: RoleNameType; targetRoleId: number }) {
    if (authorRoleName === RoleName.Admin) {
      return true;
    } else {
      const adminRoleId = await this.sharedRoleRepository.getAdminRoleId();
      if (targetRoleId === adminRoleId) {
        throw new ForbiddenException();
      }

      return true;
    }
  }

  async _getRoleIdByUserId(userId: number) {
    const user = await this.sharedUserRepository.findUnique({
      id: userId,
    });

    if (!user) {
      throw UserNotFoundException;
    }

    return user.roleId;
  }
}
