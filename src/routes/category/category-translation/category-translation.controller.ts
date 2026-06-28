import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateCategoryTranslationBodyDto,
  CreateCategoryTranslationResDto,
  GetCategoryTranslationDetailParamDto,
  GetCategoryTranslationDetailResDto,
  UpdateCategoryTranslationBodyDto,
  UpdateCategoryTranslationResDto,
} from 'src/routes/category/category-translation/category-translation.dto';
import { CategoryTranslationService } from 'src/routes/category/category-translation/category-translation.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDto } from 'src/shared/dtos/response.dto';

@Controller('category-translation')
export class CategoryTranslationController {
  constructor(private readonly categoryTranslationService: CategoryTranslationService) {}

  @Get(':categoryTranslationId')
  @ZodSerializerDto(GetCategoryTranslationDetailResDto)
  findById(@Param() param: GetCategoryTranslationDetailParamDto) {
    return this.categoryTranslationService.findById(param.categoryTranslationId);
  }

  @Post()
  @ZodSerializerDto(CreateCategoryTranslationResDto)
  create(@Body() body: CreateCategoryTranslationBodyDto, @ActiveUser('userId') userId: number) {
    return this.categoryTranslationService.create(userId, body);
  }

  @Patch(':categoryTranslationId')
  @ZodSerializerDto(UpdateCategoryTranslationResDto)
  update(
    @Param() param: GetCategoryTranslationDetailParamDto,
    @Body() body: UpdateCategoryTranslationBodyDto,
    @ActiveUser('userId') userId: number,
  ) {
    return this.categoryTranslationService.update({
      updatedById: userId,
      body,
      categoryTranslationId: param.categoryTranslationId,
    });
  }

  @Delete(':categoryTranslationId')
  @ZodSerializerDto(MessageResDto)
  delete(@Param() param: GetCategoryTranslationDetailParamDto, @ActiveUser('userId') userId: number) {
    return this.categoryTranslationService.delete(userId, param.categoryTranslationId);
  }
}
