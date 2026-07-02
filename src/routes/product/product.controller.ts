import { Controller, Get, Param, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  GetListProductQueryDto,
  GetListProductResDto,
  GetProductDetailParamDto,
  GetProductDetailResDto,
} from 'src/routes/product/product.dto';
import { ProductService } from 'src/routes/product/product.service';
import { isPublic } from 'src/shared/decorators/auth.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @isPublic()
  @ZodSerializerDto(GetListProductResDto)
  list(@Query() query: GetListProductQueryDto) {
    return this.productService.list(query);
  }

  @Get(':productId')
  @isPublic()
  @ZodSerializerDto(GetProductDetailResDto)
  findById(@Param() param: GetProductDetailParamDto) {
    return this.productService.getDetailById(param.productId);
  }
}
