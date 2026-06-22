import { Injectable } from '@nestjs/common';
import { IncorrectOldPasswordException, ProfileNotFoundException } from 'src/routes/profile/profile.error';
import { ChangePasswordBodyType, UpdateProfileBodyType } from 'src/routes/profile/profile.model';
import { ProfileRepository } from 'src/routes/profile/profile.repository';
import { UserNotFoundException } from 'src/shared/error';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repository';
import { HashingService } from 'src/shared/services/hashing.service';
import { isNotFoundPrismaError } from 'src/shared/utils';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly hashingService: HashingService,
    private readonly sharedUserRepository: SharedUserRepository,
  ) {}

  async getProfile(profileId: number) {
    try {
      return await this.profileRepository.findById(profileId);
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw ProfileNotFoundException;
      }

      throw error;
    }
  }

  async updateProfile(profileId: number, body: UpdateProfileBodyType) {
    try {
      return await this.profileRepository.update(profileId, body);
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw ProfileNotFoundException;
      }

      throw error;
    }
  }

  async changePassword(profileId: number, body: ChangePasswordBodyType) {
    try {
      const user = await this.sharedUserRepository.findUnique({
        id: profileId,
      });
      if (!user) {
        throw UserNotFoundException;
      }

      const isPasswordMatch = await this.hashingService.compare(body.oldPassword, user.password);
      if (!isPasswordMatch) {
        throw IncorrectOldPasswordException;
      }

      const hashedPassword = await this.hashingService.hash(body.newPassword);
      await this.profileRepository.changePassword(profileId, hashedPassword);

      return {
        message: 'Đổi mật khẩu thành công',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw ProfileNotFoundException;
      }

      throw error;
    }
  }
}
