import { VerificationCode } from 'src/shared/constants/auth.constant';
import { UserSchema } from 'src/shared/models/shared-user.model';
import { z } from 'zod';

export const RegisterBodySchema = UserSchema.pick({
  email: true,
  password: true,
  name: true,
  phoneNumber: true,
}).extend({
  confirmPassword: z.string().min(6).max(255),
  code: z.string().length(6),
});

export const RegisterResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
});

export const VerificationCodeSchema = z.object({
  id: z.number().int(),
  email: z.email(),
  code: z.string().length(6),
  type: z.enum(VerificationCode),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const SendOtpBodySchema = VerificationCodeSchema.pick({
  email: true,
  type: true,
}).strict();

export const LoginBodySchema = RegisterBodySchema.pick({
  email: true,
  password: true,
}).strict();

export const LoginResSchema = z.object({
  accessToken: z.jwt(),
  refreshToken: z.jwt(),
});

export const RefreshTokenBodySchema = z
  .object({
    refreshToken: z.jwt(),
  })
  .strict();

export const RefreshTokenResSchema = LoginResSchema;

export const DeviceSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  userAgent: z.string(),
  ip: z.string(),
  lastActive: z.date(),
  createdAt: z.date(),
  isActive: z.boolean(),
});

export const RefreshTokenSchema = z.object({
  token: z.jwt(),
  userId: z.number().int(),
  deviceId: z.number().int(),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const LogoutBodySchema = RefreshTokenBodySchema;

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>;

export type RegisterResType = z.infer<typeof RegisterResSchema>;

export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>;

export type SendOtpBodyType = z.infer<typeof SendOtpBodySchema>;

export type LoginBodyType = z.infer<typeof LoginBodySchema>;

export type LoginResType = z.infer<typeof LoginResSchema>;

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>;

export type RefreshTokenResType = z.infer<typeof RefreshTokenResSchema>;

export type DeviceType = z.infer<typeof DeviceSchema>;

export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>;

export type LogoutBodyType = z.infer<typeof LogoutBodySchema>;
