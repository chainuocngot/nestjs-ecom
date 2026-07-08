import { Controller, Get, Param, Query } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ZodResponse } from 'nestjs-zod';
import {
  GetListProductQueryDto,
  GetListProductResDto,
  GetProductDetailParamDto,
  GetProductDetailResDto,
} from 'src/routes/product/product.dto';
import { ProductService } from 'src/routes/product/product.service';
import { isPublic } from 'src/shared/decorators/auth.decorator';

@SkipThrottle()
@isPublic()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ZodResponse({ type: GetListProductResDto })
  list(@Query() query: GetListProductQueryDto) {
    return this.productService.list(query);
  }

  @Get(':productId')
  @ZodResponse({ type: GetProductDetailResDto })
  findById(@Param() param: GetProductDetailParamDto) {
    return this.productService.getDetailById(param.productId);
  }
}
