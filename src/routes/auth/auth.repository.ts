import { Injectable } from '@nestjs/common';
import { DeviceType, RefreshTokenType, RegisterBodyType, VerificationCodeType } from 'src/routes/auth/auth.model';
import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant';
import { RoleType, UserType } from 'src/shared/models/shared-user.model';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createUser(
    user: Omit<RegisterBodyType, 'confirmPassword' | 'code'> & Pick<UserType, 'roleId'>,
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    return this.prismaService.user.create({
      data: user,
      omit: {
        password: true,
        totpSecret: true,
      },
    });
  }

  async createVerificationCode(
    payload: Pick<VerificationCodeType, 'code' | 'email' | 'type' | 'expiresAt'>,
  ): Promise<VerificationCodeType> {
    return this.prismaService.verificationCode.upsert({
      where: {
        email: payload.email,
      },
      create: payload,
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt,
      },
    });
  }

  async findUniqueVerificationCode(
    uniqueObject:
      | { email: string }
      | { id: number }
      | {
          email: string;
          code: string;
          type: TypeOfVerificationCode;
        },
  ): Promise<VerificationCodeType | null> {
    return this.prismaService.verificationCode.findUnique({
      where: uniqueObject,
    });
  }

  async createRefreshToken(payload: { token: string; userId: number; expiresAt: Date; deviceId: number }) {
    return this.prismaService.refreshToken.create({
      data: payload,
    });
  }

  createDevice(
    payload: Pick<DeviceType, 'userId' | 'ip' | 'userAgent'> & {
      lastActive?: Date;
      isActive?: boolean;
    },
  ) {
    return this.prismaService.device.create({
      data: payload,
    });
  }

  findUniqueRefreshTokenIncludeRole(
    token: string,
  ): Promise<(RefreshTokenType & { user: UserType & { role: RoleType } }) | null> {
    return this.prismaService.refreshToken.findUnique({
      where: {
        token,
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  updateDevice(deviceId: number, data: Partial<DeviceType>): Promise<DeviceType> {
    return this.prismaService.device.update({
      where: {
        id: deviceId,
      },
      data,
    });
  }

  deleteRefreshToken(token: string): Promise<RefreshTokenType> {
    return this.prismaService.refreshToken.delete({
      where: {
        token,
      },
    });
  }
}
