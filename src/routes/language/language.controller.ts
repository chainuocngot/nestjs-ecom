import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
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
  @ZodSerializerDto(GetListLanguageResDto)
  list() {
    return this.languageService.list();
  }

  @Get(':languageId')
  @ZodSerializerDto(GetLanguageDetailResDto)
  findById(@Param() param: GetLanguageDetailParamDto) {
    return this.languageService.findById(param.languageId);
  }

  @Post()
  @ZodSerializerDto(CreateLanguageResDto)
  create(@ActiveUser('userId') userId: number, @Body() body: CreateLanguageBodyDto) {
    return this.languageService.create(userId, body);
  }

  @Patch(':languageId')
  @ZodSerializerDto(UpdateLanguageResDto)
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
  @ZodSerializerDto(MessageResDto)
  delete(@ActiveUser('userId') userId: number, @Param() param: GetLanguageDetailParamDto) {
    return this.languageService.delete(userId, param.languageId);
  }
}
