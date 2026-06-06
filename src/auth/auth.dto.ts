import { createZodDto } from 'nestjs-zod';
import { RegisterBodySchema, RegisterResSchema } from 'src/auth/auth.model';

export class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}

export class RegisterResDto extends createZodDto(RegisterResSchema) {}
