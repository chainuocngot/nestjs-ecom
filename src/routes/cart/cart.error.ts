import { BadRequestException, NotFoundException } from '@nestjs/common';

export const SkuNotFoundException = new NotFoundException('Error.SkuNotFound');

export const SkuOutOfStockException = new BadRequestException('Error.SkuOutOfStock');

export const ProductNotFoundException = new NotFoundException('Error.ProductNotFound');

export const CartItemNotFoundException = new NotFoundException('Error.CartItemNotFound');

export const InvalidQuantityException = new BadRequestException('Error.InvalidQuantity');
