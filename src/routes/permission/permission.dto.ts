import { createZodDto } from 'nestjs-zod';
import {
  CreatePermissionBodySchema,
  CreatePermissionResSchema,
  DeletePermissionParamSchema,
  GetListPermissionQuerySchema,
  GetListPermissionResSchema,
  GetPermissionDetailParamSchema,
  GetPermissionDetailResSchema,
  UpdatePermissionBodySchema,
  UpdatePermissionParamSchema,
  UpdatePermissionResSchema,
} from 'src/routes/permission/permission.model';

export class GetListPermissionQueryDto extends createZodDto(GetListPermissionQuerySchema) {}

export class GetListPermissionResDto extends createZodDto(GetListPermissionResSchema) {}

export class GetPermissionDetailParamDto extends createZodDto(GetPermissionDetailParamSchema) {}

export class GetPermissionDetailResDto extends createZodDto(GetPermissionDetailResSchema) {}

export class CreatePermissionBodyDto extends createZodDto(CreatePermissionBodySchema) {}

export class CreatePermissionResDto extends createZodDto(CreatePermissionResSchema) {}

export class UpdatePermissionParamDto extends createZodDto(UpdatePermissionParamSchema) {}

export class UpdatePermissionBodyDto extends createZodDto(UpdatePermissionBodySchema) {}

export class UpdatePermissionResDto extends createZodDto(UpdatePermissionResSchema) {}

export class DeletePermissionParamDto extends createZodDto(DeletePermissionParamSchema) {}
