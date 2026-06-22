import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { addMilliseconds } from 'date-fns';
import ms, { StringValue } from 'ms';
import { LoginBodyType, RefreshTokenBodyType, RegisterBodyType, SendOtpBodyType } from 'src/routes/auth/auth.model';
import { AuthRepository } from 'src/routes/auth/auth.repository';
import {
  EmailAlreadyExistsException,
  EmailNotFoundException,
  FailedToSendOtpException,
  IncorrectPasswordException,
  InvalidOtpException,
  OtpExpiredException,
  RefreshTokenAlreadyUsedException,
} from 'src/routes/auth/auth.error';
import { envConfig } from 'src/shared/config';
import { VerificationCode } from 'src/shared/constants/auth.constant';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repository';
import { EmailService } from 'src/shared/services/email.service';
import { HashingService } from 'src/shared/services/hashing.service';
import { TokenService } from 'src/shared/services/token.service';
import { generateOtp, isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/utils';
import { SharedRoleRepository } from 'src/shared/repositories/shared-role.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly hashingService: HashingService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly sharedRoleRepository: SharedRoleRepository,
    private readonly emailService: EmailService,
  ) {}

  async register(body: RegisterBodyType) {
    try {
      const verificationCode = await this.authRepository.findUniqueVerificationCode({
        code: body.code,
        email: body.email,
        type: VerificationCode.REGISTER,
      });

      if (!verificationCode) {
        throw InvalidOtpException;
      }

      if (verificationCode.expiresAt < new Date()) {
        throw OtpExpiredException;
      }

      const [clientRoleId, hashedPassword] = await Promise.all([
        this.sharedRoleRepository.getClientRoleId(),
        this.hashingService.hash(body.password),
      ]);

      const user = await this.authRepository.createUser({
        email: body.email,
        password: hashedPassword,
        roleId: clientRoleId,
        name: body.name,
        phoneNumber: body.phoneNumber,
      });

      return user;
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw EmailAlreadyExistsException;
      }

      throw error;
    }
  }

  async sendOtp(body: SendOtpBodyType) {
    const user = await this.sharedUserRepository.findUnique({
      email: body.email,
    });

    if (user) {
      throw EmailAlreadyExistsException;
    }

    const otpCode = generateOtp();
    const verificationCode = this.authRepository.createVerificationCode({
      email: body.email,
      type: body.type,
      code: otpCode,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN as StringValue)),
    });

    const { error } = await this.emailService.sendOTP({
      code: otpCode,
      email: body.email,
    });

    if (error) {
      throw FailedToSendOtpException;
    }

    return verificationCode;
  }

  async login(
    body: LoginBodyType & {
      userAgent: string;
      ip: string;
    },
  ) {
    const user = await this.sharedUserRepository.findUniqueIncludeRolePermissions({
      email: body.email,
    });

    if (!user) {
      throw EmailNotFoundException;
    }

    const isPasswordMatch = await this.hashingService.compare(body.password, user.password);
    if (!isPasswordMatch) {
      throw IncorrectPasswordException;
    }

    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent: body.userAgent,
      ip: body.ip,
    });

    const [accessToken, refreshToken] = await this._signTokens({
      userId: user.id,
      deviceId: device.id,
      roleId: user.roleId,
      roleName: user.role.name,
    });
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken);
    await this.authRepository.createRefreshToken({
      token: refreshToken,
      expiresAt: new Date(decodedRefreshToken.exp * 1000),
      userId: user.id,
      deviceId: device.id,
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(
    body: RefreshTokenBodyType & {
      userAgent: string;
      ip: string;
    },
  ) {
    try {
      const { userId } = await this.tokenService.verifyRefreshToken(body.refreshToken);

      const refreshTokenIncludeRole = await this.authRepository.findUniqueRefreshTokenIncludeRole(body.refreshToken);
      if (!refreshTokenIncludeRole) {
        throw RefreshTokenAlreadyUsedException;
      }

      const [tokens] = await Promise.all([
        this._signTokens({
          deviceId: refreshTokenIncludeRole.deviceId,
          roleId: refreshTokenIncludeRole.user.roleId,
          roleName: refreshTokenIncludeRole.user.role.name,
          userId,
        }),
        this.authRepository.updateDevice(refreshTokenIncludeRole.deviceId, { ip: body.ip, userAgent: body.userAgent }),
        this.authRepository.deleteRefreshToken(refreshTokenIncludeRole.token),
      ]);

      const [accessToken, refreshToken] = tokens;
      const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken);
      await this.authRepository.createRefreshToken({
        token: refreshToken,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
        userId,
        deviceId: refreshTokenIncludeRole.deviceId,
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnauthorizedException();
    }
  }

  async logout(refreshToken: string) {
    try {
      await this.tokenService.verifyRefreshToken(refreshToken);

      const deletedRefreshToken = await this.authRepository.deleteRefreshToken(refreshToken);

      await this.authRepository.updateDevice(deletedRefreshToken.deviceId, {
        isActive: false,
      });

      return { message: 'Đăng xuất thành công' };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw RefreshTokenAlreadyUsedException;
      }
      throw new UnauthorizedException();
    }
  }

  private _signTokens(payload: {
    userId: number;
    deviceId: number;
    roleId: number;
    roleName: string;
  }): Promise<[string, string]> {
    return Promise.all([
      this.tokenService.signAccessToken({
        userId: payload.userId,
        deviceId: payload.deviceId,
        roleId: payload.roleId,
        roleName: payload.roleName,
      }),
      this.tokenService.signRefreshToken({
        userId: payload.userId,
      }),
    ]);
  }
}
