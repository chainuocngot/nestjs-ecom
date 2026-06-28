import { ConflictException, NotFoundException } from '@nestjs/common';

export const BrandNotFoundException = new NotFoundException('Error.BrandNotFound');

export const BrandAlreadyExistsException = new ConflictException('Error.BrandAlreadyExists');
