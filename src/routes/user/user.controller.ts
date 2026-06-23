import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateUserBodyDto,
  CreateUserResDto,
  GetListUserQueryDto,
  GetListUserResDto,
  GetUserDetailParamDto,
  GetUserDetailResDto,
  UpdateUserBodyDto,
  UpdateUserResDto,
} from 'src/routes/user/user.dto';
import { UserService } from 'src/routes/user/user.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDto } from 'src/shared/dtos/response.dto';
import { type AccessTokenPayload } from 'src/shared/types/jwt.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ZodSerializerDto(GetListUserResDto)
  list(@Query() query: GetListUserQueryDto) {
    return this.userService.list(query);
  }

  @Get(':userId')
  @ZodSerializerDto(GetUserDetailResDto)
  findById(@Param() param: GetUserDetailParamDto) {
    return this.userService.findById(param.userId);
  }

  @Post()
  @ZodSerializerDto(CreateUserResDto)
  create(@ActiveUser() activeUser: AccessTokenPayload, @Body() body: CreateUserBodyDto) {
    return this.userService.create({
      createdById: activeUser.userId,
      body,
      authorRoleName: activeUser.roleName,
    });
  }

  @Patch(':userId')
  @ZodSerializerDto(UpdateUserResDto)
  update(
    @ActiveUser() activeUser: AccessTokenPayload,
    @Body() body: UpdateUserBodyDto,
    @Param() param: GetUserDetailParamDto,
  ) {
    return this.userService.update({
      updatedById: activeUser.userId,
      body,
      userId: param.userId,
      authorRoleName: activeUser.roleName,
    });
  }

  @Delete(':userId')
  @ZodSerializerDto(MessageResDto)
  delete(@ActiveUser() activeUser: AccessTokenPayload, @Param() param: GetUserDetailParamDto) {
    return this.userService.delete({
      deletedById: activeUser.userId,
      userId: param.userId,
      authorRoleName: activeUser.roleName,
    });
  }
}
