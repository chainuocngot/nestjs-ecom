import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateProductBodyDto,
  CreateProductResDto,
  GetListProductQueryDto,
  GetListProductResDto,
  GetProductDetailParamDto,
  GetProductDetailResDto,
  UpdateProductBodyDto,
  UpdateProductResDto,
} from 'src/routes/product/product.dto';
import { ProductService } from 'src/routes/product/product.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDto } from 'src/shared/dtos/response.dto';

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
    return this.productService.findById(param.productId);
  }

  @Post()
  @ZodSerializerDto(CreateProductResDto)
  create(@ActiveUser('userId') userId: number, @Body() body: CreateProductBodyDto) {
    return this.productService.create(userId, body);
  }

  @Put(':productId')
  @ZodSerializerDto(UpdateProductResDto)
  update(
    @ActiveUser('userId') userId: number,
    @Param() param: GetProductDetailParamDto,
    @Body() body: UpdateProductBodyDto,
  ) {
    return this.productService.update({
      body,
      productId: param.productId,
      updatedById: userId,
    });
  }

  @Delete(':productId')
  @ZodSerializerDto(MessageResDto)
  delete(@ActiveUser('userId') userId: number, @Param() param: GetProductDetailParamDto) {
    return this.productService.delete(userId, param.productId);
  }
}
