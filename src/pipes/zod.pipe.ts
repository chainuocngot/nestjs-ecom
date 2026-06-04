import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';

export const ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => {
    return new UnprocessableEntityException({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: 'Lỗi xác thực dữ liệu',
      errors: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      })),
    });
  },
});
