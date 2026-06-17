import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  GetPermissionDetailParamDto,
  GetPermissionDetailResDto,
  GetListPermissionQueryDto,
  GetListPermissionResDto,
  CreatePermissionResDto,
  CreatePermissionBodyDto,
  UpdatePermissionResDto,
  UpdatePermissionBodyDto,
  UpdatePermissionParamDto,
  DeletePermissionParamDto,
} from 'src/routes/permission/permission.dto';
import { PermissionService } from 'src/routes/permission/permission.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDto } from 'src/shared/dtos/response.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ZodSerializerDto(GetListPermissionResDto)
  list(@Query() query: GetListPermissionQueryDto) {
    return this.permissionService.list({
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':permissionId')
  @ZodSerializerDto(GetPermissionDetailResDto)
  findById(@Param() param: GetPermissionDetailParamDto) {
    return this.permissionService.findById(param.permissionId);
  }

  @Post()
  @ZodSerializerDto(CreatePermissionResDto)
  create(@ActiveUser('userId') userId: number, @Body() body: CreatePermissionBodyDto) {
    return this.permissionService.create(userId, body);
  }

  @Patch(':permissionId')
  @ZodSerializerDto(UpdatePermissionResDto)
  update(
    @Param() param: UpdatePermissionParamDto,
    @Body() body: UpdatePermissionBodyDto,
    @ActiveUser('userId') userId: number,
  ) {
    return this.permissionService.update({
      permissionId: param.permissionId,
      body,
      updatedById: userId,
    });
  }

  @Delete(':permissionId')
  @ZodSerializerDto(MessageResDto)
  delete(@Param() param: DeletePermissionParamDto, @ActiveUser('userId') userId: number) {
    return this.permissionService.delete(userId, param.permissionId);
  }
}
