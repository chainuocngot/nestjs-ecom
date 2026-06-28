import { ConflictException, NotFoundException } from '@nestjs/common';

export const BrandTranslationNotFoundException = new NotFoundException('Error.BrandTranslationNotFound');

export const BrandTranslationAlreadyExistsException = new ConflictException('Error.BrandTranslationAlreadyExists');

export const BrandOrLanguageNotFoundException = new NotFoundException('Error.BrandOrLanguageNotFound');
