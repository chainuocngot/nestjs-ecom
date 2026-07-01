import { Controller, Get, Param, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  GetListProductQueryDto,
  GetListProductResDto,
  GetProductDetailParamDto,
  GetProductDetailResDto,
} from 'src/routes/product/product.dto';
import { ProductService } from 'src/routes/product/product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ZodSerializerDto(GetListProductResDto)
  list(@Query() query: GetListProductQueryDto) {
    return this.productService.list(query);
  }

  @Get(':productId')
  @ZodSerializerDto(GetProductDetailResDto)
  findById(@Param() param: GetProductDetailParamDto) {
    return this.productService.getDetailById(param.productId);
  }
}
