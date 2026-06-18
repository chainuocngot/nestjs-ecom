import { PermissionSchema } from 'src/routes/permission/permission.model';
import { PaginationQuerySchema } from 'src/shared/models/request.model';
import { z } from 'zod';

export const RoleSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  isActive: z.boolean(),
  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  deletedById: z.number().int().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const RoleIncludePermissions = RoleSchema.extend({
  permissions: z.array(PermissionSchema),
});

export const GetListRoleQuerySchema = PaginationQuerySchema;

export const GetListRoleResSchema = z.object({
  total: z.number().int(),
  records: z.array(RoleSchema),
});

export const GetRoleDetailParamSchema = z.object({
  roleId: z.coerce.number(),
});

export const GetRoleDetailResSchema = RoleIncludePermissions;

export const CreateRoleBodySchema = RoleSchema.pick({
  name: true,
  description: true,
  isActive: true,
}).strict();

export const CreateRoleResSchema = RoleSchema;

export const UpdateRoleParamSchema = GetRoleDetailParamSchema;

export const UpdateRoleBodySchema = CreateRoleBodySchema.extend({
  permissionIds: z.array(z.number().int()),
}).partial();

export const UpdateRoleResSchema = RoleIncludePermissions;

export const DeleteRoleParamSchema = GetRoleDetailParamSchema;

export type RoleType = z.infer<typeof RoleSchema>;

export type GetListRoleQueryType = z.infer<typeof GetListRoleQuerySchema>;

export type GetListRoleResType = z.infer<typeof GetListRoleResSchema>;

export type GetRoleDetailParamType = z.infer<typeof GetRoleDetailParamSchema>;

export type GetRoleDetailResType = z.infer<typeof GetRoleDetailResSchema>;

export type CreateRoleBodyType = z.infer<typeof CreateRoleBodySchema>;

export type CreateRoleResType = z.infer<typeof CreateRoleResSchema>;

export type UpdateRoleParamType = z.infer<typeof UpdateRoleParamSchema>;

export type UpdateRoleBodyType = z.infer<typeof UpdateRoleBodySchema>;

export type UpdateRoleResType = z.infer<typeof UpdateRoleResSchema>;

export type DeleteRoleParamType = z.infer<typeof DeleteRoleParamSchema>;
