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

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>;

export const RegisterResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
});

export type RegisterResType = z.infer<typeof RegisterResSchema>;

export const VerificationCodeSchema = z.object({
  id: z.number().int(),
  email: z.email(),
  code: z.string().length(6),
  type: z.enum(VerificationCode),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>;

export const SendOtpBodySchema = VerificationCodeSchema.pick({
  email: true,
  type: true,
}).strict();

export type SendOtpBodyType = z.infer<typeof SendOtpBodySchema>;
