import { Injectable } from '@nestjs/common';
import { DeviceType, RegisterBodyType, VerificationCodeType } from 'src/auth/auth.model';
import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant';
import { UserType } from 'src/shared/models/shared-user.model';
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

  async createRefreshToken(payload: { token: string; userId: number; expiresAt: Date }) {
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
}
