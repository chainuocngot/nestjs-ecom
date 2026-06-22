import { HTTPMethod } from 'src/generated/prisma/enums';
import { PaginationQuerySchema } from 'src/shared/models/request.model';
import { z } from 'zod';

export const PermissionSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
  path: z.string(),
  method: z.enum(HTTPMethod),
  module: z.string(),
  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetListPermissionQuerySchema = PaginationQuerySchema;

export const GetListPermissionResSchema = z.object({
  total: z.number().int(),
  records: z.array(PermissionSchema),
});

export const GetPermissionDetailParamSchema = z.object({
  permissionId: z.coerce.number(),
});

export const GetPermissionDetailResSchema = PermissionSchema;

export const CreatePermissionBodySchema = PermissionSchema.pick({
  method: true,
  name: true,
  path: true,
  module: true,
}).strict();

export const CreatePermissionResSchema = PermissionSchema;

export const UpdatePermissionParamSchema = GetPermissionDetailParamSchema;

export const UpdatePermissionBodySchema = CreatePermissionBodySchema.partial();

export const UpdatePermissionResSchema = PermissionSchema;

export const DeletePermissionParamSchema = GetPermissionDetailParamSchema;

export type PermissionType = z.infer<typeof PermissionSchema>;

export type GetListPermissionQueryType = z.infer<typeof GetListPermissionQuerySchema>;

export type GetListPermissionResType = z.infer<typeof GetListPermissionResSchema>;

export type GetPermissionDetailParamType = z.infer<typeof GetPermissionDetailParamSchema>;

export type GetPermissionDetailResType = z.infer<typeof GetPermissionDetailResSchema>;

export type CreatePermissionBodyType = z.infer<typeof CreatePermissionBodySchema>;

export type CreatePermissionResType = z.infer<typeof CreatePermissionResSchema>;

export type UpdatePermissionBodyType = z.infer<typeof UpdatePermissionBodySchema>;

export type UpdatePermissionResType = z.infer<typeof UpdatePermissionResSchema>;

export type DeletePermissionParamType = z.infer<typeof DeletePermissionParamSchema>;
