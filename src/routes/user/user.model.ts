import { PaginationQuerySchema } from 'src/shared/models/request.model';
import { RoleSchema, UserSchema } from 'src/shared/models/shared-user.model';
import { z } from 'zod';

export const GetListUserQuerySchema = PaginationQuerySchema;

export const GetListUserResSchema = z.object({
  total: z.number().int(),
  records: z.array(
    UserSchema.omit({
      password: true,
      totpSecret: true,
    }).extend({
      role: RoleSchema.pick({
        id: true,
        name: true,
      }),
    }),
  ),
});

export const GetUserDetailParamSchema = z.object({
  userId: z.coerce.number().int(),
});

export const GetUserDetailResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
});

export const CreateUserBodySchema = UserSchema.pick({
  email: true,
  name: true,
  phoneNumber: true,
  avatar: true,
  password: true,
  roleId: true,
  status: true,
}).strict();

export const CreateUserResSchema = GetUserDetailResSchema;

export const UpdateUserBodySchema = CreateUserBodySchema.partial();

export const UpdateUserResSchema = GetUserDetailResSchema;

export type GetListUserQueryType = z.infer<typeof GetListUserQuerySchema>;

export type GetListUserResType = z.infer<typeof GetListUserResSchema>;

export type GetUserDetailParamType = z.infer<typeof GetUserDetailParamSchema>;

export type GetUserDetailResType = z.infer<typeof GetUserDetailResSchema>;

export type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>;

export type CreateUserResType = z.infer<typeof CreateUserResSchema>;

export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>;

export type UpdateUserResType = z.infer<typeof UpdateUserResSchema>;
