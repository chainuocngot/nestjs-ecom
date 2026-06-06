import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RoleService } from 'src/auth/role.service';
import { AuthRepository } from 'src/auth/auth.repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RoleService, AuthRepository],
})
export class AuthModule {}
