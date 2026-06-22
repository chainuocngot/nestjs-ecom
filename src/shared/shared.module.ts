import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { HashingService } from './services/hashing.service';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repository';
import { EmailService } from 'src/shared/services/email.service';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard';
import { SharedRoleRepository } from 'src/shared/repositories/shared-role.repository';

const sharedServices = [
  PrismaService,
  TokenService,
  HashingService,
  SharedUserRepository,
  SharedRoleRepository,
  EmailService,
  AccessTokenGuard,
  ApiKeyGuard,
];

@Global()
@Module({
  providers: sharedServices,
  exports: sharedServices,
  imports: [JwtModule],
})
export class SharedModule {}
