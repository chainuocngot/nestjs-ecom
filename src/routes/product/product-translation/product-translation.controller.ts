import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateProductTranslationBodyDto,
  CreateProductTranslationResDto,
  GetProductTranslationDetailParamDto,
  GetProductTranslationDetailResDto,
  UpdateProductTranslationBodyDto,
  UpdateProductTranslationResDto,
} from 'src/routes/product/product-translation/product-translation.dto';
import { ProductTranslationService } from 'src/routes/product/product-translation/product-translation.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDto } from 'src/shared/dtos/response.dto';

@Controller('product-translation')
export class ProductTranslationController {
  constructor(private readonly productTranslationService: ProductTranslationService) {}

  @Get(':productTranslationId')
  @ZodSerializerDto(GetProductTranslationDetailResDto)
  findById(@Param() param: GetProductTranslationDetailParamDto) {
    return this.productTranslationService.findById(param.productTranslationId);
  }

  @Post()
  @ZodSerializerDto(CreateProductTranslationResDto)
  create(@Body() body: CreateProductTranslationBodyDto, @ActiveUser('userId') userId: number) {
    return this.productTranslationService.create(userId, body);
  }

  @Patch(':productTranslationId')
  @ZodSerializerDto(UpdateProductTranslationResDto)
  update(
    @Param() param: GetProductTranslationDetailParamDto,
    @Body() body: UpdateProductTranslationBodyDto,
    @ActiveUser('userId') userId: number,
  ) {
    return this.productTranslationService.update({
      updatedById: userId,
      body,
      productTranslationId: param.productTranslationId,
    });
  }

  @Delete(':productTranslationId')
  @ZodSerializerDto(MessageResDto)
  delete(@Param() param: GetProductTranslationDetailParamDto, @ActiveUser('userId') userId: number) {
    return this.productTranslationService.delete(userId, param.productTranslationId);
  }
}
