import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterBodyDto } from 'src/auth/auth.dto';
import { AuthRepository } from 'src/auth/auth.repository';
import { RoleService } from 'src/auth/role.service';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TokenService } from 'src/shared/services/token.service';
import { isUniqueConstraintPrismaError } from 'src/shared/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly roleService: RoleService,
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly authRepository: AuthRepository,
  ) {}

  async register(body: RegisterBodyDto) {
    try {
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
        throw new ConflictException('Email đã tồn tại');
      }

      throw error;
    }
  }

  private _signTokens(userId: number): [Promise<string>, Promise<string>] {
    return [this.tokenService.signAccessToken({ userId }), this.tokenService.signRefreshToken({ userId })] as const;
  }
}
