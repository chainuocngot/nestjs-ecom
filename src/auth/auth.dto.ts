import { createZodDto } from 'nestjs-zod';
import {
  LoginBodySchema,
  LoginResSchema,
  LogoutBodySchema,
  RefreshTokenBodySchema,
  RefreshTokenResSchema,
  RegisterBodySchema,
  RegisterResSchema,
  SendOtpBodySchema,
  SendOtpResSchema,
} from 'src/auth/auth.model';

export class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}

export class RegisterResDto extends createZodDto(RegisterResSchema) {}

export class SendOtpBodyDto extends createZodDto(SendOtpBodySchema) {}

export class SendOtpResDto extends createZodDto(SendOtpResSchema) {}

export class LoginBodyDto extends createZodDto(LoginBodySchema) {}

export class LoginResDto extends createZodDto(LoginResSchema) {}

export class RefreshTokenBodyDto extends createZodDto(RefreshTokenBodySchema) {}

export class RefreshTokenResDto extends createZodDto(RefreshTokenResSchema) {}

export class LogoutBodyDto extends createZodDto(LogoutBodySchema) {}
