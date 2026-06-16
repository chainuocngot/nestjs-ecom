import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { addMilliseconds } from 'date-fns';
import ms, { StringValue } from 'ms';
import { LoginBodyType, RegisterBodyType, SendOtpBodyType } from 'src/auth/auth.model';
import { AuthRepository } from 'src/auth/auth.repository';
import { RoleService } from 'src/auth/role.service';
import { envConfig } from 'src/shared/config';
import { VerificationCode } from 'src/shared/constants/auth.constant';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repository';
import { EmailService } from 'src/shared/services/email.service';
import { HashingService } from 'src/shared/services/hashing.service';
import { TokenService } from 'src/shared/services/token.service';
import { generateOtp, isUniqueConstraintPrismaError } from 'src/shared/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly roleService: RoleService,
    private readonly hashingService: HashingService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
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
        throw new UnprocessableEntityException({
          message: 'Mã OTP không hợp lệ',
          path: 'code',
        });
      }

      if (verificationCode.expiresAt < new Date()) {
        throw new UnprocessableEntityException({
          message: 'Mã OTP đã hết hạn',
          path: 'code',
        });
      }

      const [clientRoleId, hashedPassword] = await Promise.all([
        this.roleService.getClientRoleId(),
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
        throw new UnprocessableEntityException({
          message: 'Email đã tồn tại',
          path: 'email',
        });
      }

      throw error;
    }
  }

  async sendOtp(body: SendOtpBodyType) {
    const user = await this.sharedUserRepository.findUnique({
      email: body.email,
    });

    if (user) {
      throw new UnprocessableEntityException({
        message: 'Email đã tồn tại',
        path: 'email',
      });
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
      throw new UnprocessableEntityException({
        message: 'Gửi mã OTP thất bại',
        path: 'code',
      });
    }

    return verificationCode;
  }

  async login(
    body: LoginBodyType & {
      userAgent: string;
      ip: string;
    },
  ) {
    const user = await this.sharedUserRepository.findUniqueIncludeRole({
      email: body.email,
    });

    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    const isPasswordMatch = await this.hashingService.compare(body.password, user.password);
    if (!isPasswordMatch) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Mật khẩu không đúng',
        },
      ]);
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
    });

    return { accessToken, refreshToken };
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
