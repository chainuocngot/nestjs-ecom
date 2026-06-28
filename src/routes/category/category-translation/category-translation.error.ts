import { ConflictException, NotFoundException } from '@nestjs/common';

export const CategoryTranslationNotFoundException = new NotFoundException('Error.CategoryTranslationNotFound');

export const CategoryTranslationAlreadyExistsException = new ConflictException(
  'Error.CategoryTranslationAlreadyExists',
);

export const CategoryOrLanguageNotFoundException = new NotFoundException('Error.CategoryOrLanguageNotFound');
