import { createZodDto } from 'nestjs-zod';
import {
  CreateRoleBodySchema,
  CreateRoleResSchema,
  DeleteRoleParamSchema,
  GetListRoleQuerySchema,
  GetListRoleResSchema,
  GetRoleDetailParamSchema,
  GetRoleDetailResSchema,
  UpdateRoleBodySchema,
  UpdateRoleParamSchema,
  UpdateRoleResSchema,
} from 'src/routes/role/role.model';

export class GetListRoleQueryDto extends createZodDto(GetListRoleQuerySchema) {}

export class GetListRoleResDto extends createZodDto(GetListRoleResSchema) {}

export class GetRoleDetailParamDto extends createZodDto(GetRoleDetailParamSchema) {}

export class GetRoleDetailResDto extends createZodDto(GetRoleDetailResSchema) {}

export class CreateRoleBodyDto extends createZodDto(CreateRoleBodySchema) {}

export class CreateRoleResDto extends createZodDto(CreateRoleResSchema) {}

export class UpdateRoleParamDto extends createZodDto(UpdateRoleParamSchema) {}

export class UpdateRoleBodyDto extends createZodDto(UpdateRoleBodySchema) {}

export class UpdateRoleResDto extends createZodDto(UpdateRoleResSchema) {}

export class DeleteRoleParamDto extends createZodDto(DeleteRoleParamSchema) {}
