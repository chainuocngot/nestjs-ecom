import { UserStatus } from 'src/shared/constants/auth.constant';
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number().int(),
  email: z.email(),
  name: z.string(),
  phoneNumber: z.string(),
  avatar: z.string().nullable(),
  status: z.enum(UserStatus),
  roleId: z.number().int(),
  totpSecret: z.string().nullable(),
  password: z.string().min(6).max(255),
  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserType = z.infer<typeof UserSchema>;
