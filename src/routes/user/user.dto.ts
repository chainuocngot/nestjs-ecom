import { createZodDto } from 'nestjs-zod';
import {
  CreateUserBodySchema,
  CreateUserResSchema,
  GetListUserQuerySchema,
  GetListUserResSchema,
  GetUserDetailParamSchema,
  GetUserDetailResSchema,
  UpdateUserBodySchema,
  UpdateUserResSchema,
} from 'src/routes/user/user.model';

export class GetListUserQueryDto extends createZodDto(GetListUserQuerySchema) {}

export class GetListUserResDto extends createZodDto(GetListUserResSchema) {}

export class GetUserDetailParamDto extends createZodDto(GetUserDetailParamSchema) {}

export class GetUserDetailResDto extends createZodDto(GetUserDetailResSchema) {}

export class CreateUserBodyDto extends createZodDto(CreateUserBodySchema) {}

export class CreateUserResDto extends createZodDto(CreateUserResSchema) {}

export class UpdateUserBodyDto extends createZodDto(UpdateUserBodySchema) {}

export class UpdateUserResDto extends createZodDto(UpdateUserResSchema) {}
