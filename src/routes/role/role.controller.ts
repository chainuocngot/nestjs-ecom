import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateRoleBodyDto,
  CreateRoleResDto,
  DeleteRoleParamDto,
  GetListRoleQueryDto,
  GetListRoleResDto,
  GetRoleDetailParamDto,
  GetRoleDetailResDto,
  UpdateRoleBodyDto,
  UpdateRoleResDto,
} from 'src/routes/role/role.dto';
import { RoleService } from 'src/routes/role/role.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDto } from 'src/shared/dtos/response.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ZodSerializerDto(GetListRoleResDto)
  list(@Query() query: GetListRoleQueryDto) {
    return this.roleService.list({
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':roleId')
  @ZodSerializerDto(GetRoleDetailResDto)
  findByid(@Param() param: GetRoleDetailParamDto) {
    return this.roleService.findById(param.roleId);
  }

  @Post()
  @ZodSerializerDto(CreateRoleResDto)
  create(@Body() body: CreateRoleBodyDto, @ActiveUser('userId') userId: number) {
    return this.roleService.create(userId, body);
  }

  @Patch(':roleId')
  @ZodSerializerDto(UpdateRoleResDto)
  update(@Param() param: GetRoleDetailParamDto, @Body() body: UpdateRoleBodyDto, @ActiveUser('userId') userId: number) {
    return this.roleService.update({
      updatedById: userId,
      body,
      roleId: param.roleId,
    });
  }

  @Delete(':roleId')
  @ZodSerializerDto(MessageResDto)
  delete(@Param() param: DeleteRoleParamDto, @ActiveUser('userId') userId: number) {
    return this.roleService.delete(userId, param.roleId);
  }
}
