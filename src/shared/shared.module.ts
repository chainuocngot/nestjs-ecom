import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { HashingService } from './services/hashing.service';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repository';
import { EmailService } from 'src/shared/services/email.service';

@Global()
@Module({
  providers: [PrismaService, TokenService, HashingService, SharedUserRepository, EmailService],
  exports: [PrismaService, TokenService, HashingService, SharedUserRepository, EmailService],
  imports: [JwtModule],
})
export class SharedModule {}
