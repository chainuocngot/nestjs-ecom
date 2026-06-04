import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { HashingService } from './services/hashing.service';

@Global()
@Module({
  providers: [PrismaService, TokenService, HashingService],
  exports: [PrismaService, TokenService, HashingService],
  imports: [JwtModule],
})
export class SharedModule {}
