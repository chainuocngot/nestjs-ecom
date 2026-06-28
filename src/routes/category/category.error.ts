import { ConflictException, NotFoundException } from '@nestjs/common';

export const CategoryNotFoundException = new NotFoundException('Error.CategoryNotFound');

export const CategoryAlreadyExistsException = new ConflictException('Error.CategoryAlreadyExists');
