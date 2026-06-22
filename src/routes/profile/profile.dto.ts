import { createZodDto } from 'nestjs-zod';
import {
  ChangePasswordBodySchema,
  GetProfileResSchema,
  UpdateProfileBodySchema,
  UpdateProfileResSchema,
} from 'src/routes/profile/profile.model';

export class GetProfileResDto extends createZodDto(GetProfileResSchema) {}

export class UpdateProfileBodyDto extends createZodDto(UpdateProfileBodySchema) {}

export class UpdateProfileResDto extends createZodDto(UpdateProfileResSchema) {}

export class ChangePasswordBodyDto extends createZodDto(ChangePasswordBodySchema) {}
