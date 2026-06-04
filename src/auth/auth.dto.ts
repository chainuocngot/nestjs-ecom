import { createZodDto } from 'nestjs-zod';
import { UserStatus } from 'src/generated/prisma/enums';
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number().int(),
  email: z.email(),
  name: z.string(),
  phoneNumber: z.string(),
  avatar: z.string().nullable(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]),
  roleId: z.number().int(),
  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const RegisterBodySchema = z
  .object({
    email: z.email(),
    password: z.string().min(6).max(255),
    confirmPassword: z.string().min(6).max(255),
    name: z.string().min(1).max(255),
    phoneNumber: z.string().min(1).max(20),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
  });

export class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}

export class RegisterResDto extends createZodDto(UserSchema) {}
