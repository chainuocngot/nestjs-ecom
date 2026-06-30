import { ConflictException, NotFoundException } from '@nestjs/common';

export const ProductTranslationNotFoundException = new NotFoundException('Error.ProductTranslationNotFound');

export const ProductTranslationAlreadyExistsException = new ConflictException('Error.ProductTranslationAlreadyExists');

export const ProductOrLanguageNotFoundException = new NotFoundException('Error.ProductOrLanguageNotFound');
