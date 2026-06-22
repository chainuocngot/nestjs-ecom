import { PermissionSchema } from 'src/routes/permission/permission.model';
import { RoleSchema, UserSchema } from 'src/shared/models/shared-user.model';
import { z } from 'zod';

export const GetProfileResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
}).extend({
  role: RoleSchema.pick({
    id: true,
    name: true,
  }).extend({
    permissions: z.array(
      PermissionSchema.pick({
        id: true,
        method: true,
        module: true,
        name: true,
        path: true,
      }),
    ),
  }),
});

export const UpdateProfileBodySchema = UserSchema.pick({
  avatar: true,
  name: true,
  phoneNumber: true,
})
  .partial()
  .strict();

export const UpdateProfileResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
});

export const ChangePasswordBodySchema = z
  .object({
    oldPassword: z.string().min(6).max(255),
    newPassword: z.string().min(6).max(255),
    confirmNewPassword: z.string().min(6).max(255),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmNewPassword'],
  })
  .strict();

export type GetProfileResType = z.infer<typeof GetProfileResSchema>;

export type UpdateProfileBodyType = z.infer<typeof UpdateProfileBodySchema>;

export type UpdateProfileResType = z.infer<typeof UpdateProfileResSchema>;

export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>;
