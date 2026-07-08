import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';
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
  @ZodResponse({ type: GetListBrandResDto })
  list(@Query() query: GetListBrandQueryDto) {
    return this.brandService.list(query);
  }

  @Get(':brandId')
  @isPublic()
  @ZodResponse({ type: GetBrandDetailResDto })
  findById(@Param() param: GetBrandDetailParamDto) {
    return this.brandService.findById(param.brandId);
  }

  @Post()
  @ZodResponse({ type: CreateBrandResDto })
  create(@Body() body: CreateBrandBodyDto, @ActiveUser('userId') userId: number) {
    return this.brandService.create(userId, body);
  }

  @Patch(':brandId')
  @ZodResponse({ type: UpdateBrandResDto })
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
  @ZodResponse({ type: MessageResDto })
  delete(@Param() param: GetBrandDetailParamDto, @ActiveUser('userId') userId: number) {
    return this.brandService.delete(userId, param.brandId);
  }
}
