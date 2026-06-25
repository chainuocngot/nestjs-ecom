import { ConflictException, NotFoundException } from '@nestjs/common';

export const LanguageNotFoundException = new NotFoundException('Error.LanguageNotFound');

export const LanguageAlreadyExistsException = new ConflictException('Error.LanguageAlreadyExists');
