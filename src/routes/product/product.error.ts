import { ConflictException, NotFoundException } from '@nestjs/common';

export const ProductNotFoundException = new NotFoundException('Error.ProductNotFound');

export const ProductAlreadyExistsException = new ConflictException('Error.ProductAlreadyExists');

export const BrandNotFoundException = new NotFoundException('Error.BrandNotFound');

export const CategoryNotFoundException = new NotFoundException('Error.CategoryNotFound');

export const ProductOrCategoryNotFoundException = new NotFoundException('Error.ProductOrCategoryNotFound');
