import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateBrandTranslationBodyDto,
  CreateBrandTranslationResDto,
  GetBrandTranslationDetailParamDto,
  GetBrandTranslationDetailResDto,
  UpdateBrandTranslationBodyDto,
  UpdateBrandTranslationResDto,
} from 'src/routes/brand/brand-translation/brand-translation.dto';
import { BrandTranslationService } from 'src/routes/brand/brand-translation/brand-translation.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDto } from 'src/shared/dtos/response.dto';

@Controller('brand-translation')
export class BrandTranslationController {
  constructor(private readonly brandTranslationService: BrandTranslationService) {}

  @Get(':brandTranslationId')
  @ZodSerializerDto(GetBrandTranslationDetailResDto)
  findById(@Param() param: GetBrandTranslationDetailParamDto) {
    return this.brandTranslationService.findById(param.brandTranslationId);
  }

  @Post()
  @ZodSerializerDto(CreateBrandTranslationResDto)
  create(@Body() body: CreateBrandTranslationBodyDto, @ActiveUser('userId') userId: number) {
    return this.brandTranslationService.create(userId, body);
  }

  @Patch(':brandTranslationId')
  @ZodSerializerDto(UpdateBrandTranslationResDto)
  update(
    @Param() param: GetBrandTranslationDetailParamDto,
    @Body() body: UpdateBrandTranslationBodyDto,
    @ActiveUser('userId') userId: number,
  ) {
    return this.brandTranslationService.update({
      updatedById: userId,
      body,
      brandTranslationId: param.brandTranslationId,
    });
  }

  @Delete(':brandTranslationId')
  @ZodSerializerDto(MessageResDto)
  delete(@Param() param: GetBrandTranslationDetailParamDto, @ActiveUser('userId') userId: number) {
    return this.brandTranslationService.delete(userId, param.brandTranslationId);
  }
}
