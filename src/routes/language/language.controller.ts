import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';
import {
  CreateLanguageBodyDto,
  CreateLanguageResDto,
  GetLanguageDetailParamDto,
  GetLanguageDetailResDto,
  GetListLanguageResDto,
  UpdateLanguageBodyDto,
  UpdateLanguageResDto,
} from 'src/routes/language/language.dto';
import { LanguageService } from 'src/routes/language/language.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDto } from 'src/shared/dtos/response.dto';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  @ZodResponse({ type: GetListLanguageResDto })
  list() {
    return this.languageService.list();
  }

  @Get(':languageId')
  @ZodResponse({ type: GetLanguageDetailResDto })
  findById(@Param() param: GetLanguageDetailParamDto) {
    return this.languageService.findById(param.languageId);
  }

  @Post()
  @ZodResponse({ type: CreateLanguageResDto })
  create(@ActiveUser('userId') userId: number, @Body() body: CreateLanguageBodyDto) {
    return this.languageService.create(userId, body);
  }

  @Patch(':languageId')
  @ZodResponse({ type: UpdateLanguageResDto })
  update(
    @ActiveUser('userId') userId: number,
    @Body() body: UpdateLanguageBodyDto,
    @Param() param: GetLanguageDetailParamDto,
  ) {
    return this.languageService.update({
      updatedById: userId,
      body,
      languageId: param.languageId,
    });
  }

  @Delete(':languageId')
  @ZodResponse({ type: MessageResDto })
  delete(@ActiveUser('userId') userId: number, @Param() param: GetLanguageDetailParamDto) {
    return this.languageService.delete(userId, param.languageId);
  }
}
