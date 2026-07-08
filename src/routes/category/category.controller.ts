import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';
import {
  CreateCategoryBodyDto,
  CreateCategoryResDto,
  GetCategoryDetailParamDto,
  GetCategoryDetailResDto,
  GetListCategoryQueryDto,
  GetListCategoryResDto,
  UpdateCategoryBodyDto,
  UpdateCategoryResDto,
} from 'src/routes/category/category.dto';
import { CategoryService } from 'src/routes/category/category.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { isPublic } from 'src/shared/decorators/auth.decorator';
import { MessageResDto } from 'src/shared/dtos/response.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @isPublic()
  @ZodResponse({ type: GetListCategoryResDto })
  list(@Query() query: GetListCategoryQueryDto) {
    return this.categoryService.list(query);
  }

  @Get(':categoryId')
  @isPublic()
  @ZodResponse({ type: GetCategoryDetailResDto })
  findById(@Param() param: GetCategoryDetailParamDto) {
    return this.categoryService.findById(param.categoryId);
  }

  @Post()
  @ZodResponse({ type: CreateCategoryResDto })
  create(@Body() body: CreateCategoryBodyDto, @ActiveUser('userId') userId: number) {
    return this.categoryService.create(userId, body);
  }

  @Patch(':categoryId')
  @ZodResponse({ type: UpdateCategoryResDto })
  update(
    @Param() param: GetCategoryDetailParamDto,
    @Body() body: UpdateCategoryBodyDto,
    @ActiveUser('userId') userId: number,
  ) {
    return this.categoryService.update({
      updatedById: userId,
      body,
      categoryId: param.categoryId,
    });
  }

  @Delete(':categoryId')
  @ZodResponse({ type: MessageResDto })
  delete(@Param() param: GetCategoryDetailParamDto, @ActiveUser('userId') userId: number) {
    return this.categoryService.delete(userId, param.categoryId);
  }
}
