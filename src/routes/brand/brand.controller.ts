import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateBrandBodyDto,
  CreateBrandResDto,
  GetBrandDetailParamDto,
  GetBrandDetailResDto,
  GetListBrandQueryDto,
  GetListBrandResDto,
  UpdateBrandBodyDto,
  UpdateBrandResDto,
} from 'src/routes/brand/brand.dto';
import { BrandService } from 'src/routes/brand/brand.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { isPublic } from 'src/shared/decorators/auth.decorator';
import { MessageResDto } from 'src/shared/dtos/response.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @isPublic()
  @ZodSerializerDto(GetListBrandResDto)
  list(@Query() query: GetListBrandQueryDto) {
    return this.brandService.list(query);
  }

  @Get(':brandId')
  @isPublic()
  @ZodSerializerDto(GetBrandDetailResDto)
  findById(@Param() param: GetBrandDetailParamDto) {
    return this.brandService.findById(param.brandId);
  }

  @Post()
  @ZodSerializerDto(CreateBrandResDto)
  create(@Body() body: CreateBrandBodyDto, @ActiveUser('userId') userId: number) {
    return this.brandService.create(userId, body);
  }

  @Patch(':brandId')
  @ZodSerializerDto(UpdateBrandResDto)
  update(
    @Param() param: GetBrandDetailParamDto,
    @Body() body: UpdateBrandBodyDto,
    @ActiveUser('userId') userId: number,
  ) {
    return this.brandService.update({
      updatedById: userId,
      body,
      brandId: param.brandId,
    });
  }

  @Delete(':brandId')
  @ZodSerializerDto(MessageResDto)
  delete(@Param() param: GetBrandDetailParamDto, @ActiveUser('userId') userId: number) {
    return this.brandService.delete(userId, param.brandId);
  }
}
