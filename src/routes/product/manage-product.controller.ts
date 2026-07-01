import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateProductBodyDto,
  CreateProductResDto,
  GetListManageProductQueryDto,
  GetListProductResDto,
  GetProductDetailParamDto,
  GetProductDetailResDto,
  UpdateProductBodyDto,
  UpdateProductResDto,
} from 'src/routes/product/product.dto';
import { ManageProductService } from 'src/routes/product/manage-product.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDto } from 'src/shared/dtos/response.dto';
import { type AccessTokenPayload } from 'src/shared/types/jwt.type';

@Controller('manage-product')
export class ManageProductController {
  constructor(private readonly manageProductService: ManageProductService) {}

  @Get()
  @ZodSerializerDto(GetListProductResDto)
  list(@ActiveUser() activeUser: AccessTokenPayload, @Query() query: GetListManageProductQueryDto) {
    return this.manageProductService.list({
      query,
      requestRoleName: activeUser.roleName,
      requestUserId: activeUser.userId,
    });
  }

  @Get(':productId')
  @ZodSerializerDto(GetProductDetailResDto)
  getDetailById(@ActiveUser() activeUser: AccessTokenPayload, @Param() param: GetProductDetailParamDto) {
    return this.manageProductService.getDetailById({
      productId: param.productId,
      requestRoleName: activeUser.roleName,
      requestUserId: activeUser.userId,
    });
  }

  @Post()
  @ZodSerializerDto(CreateProductResDto)
  create(@ActiveUser('userId') userId: number, @Body() body: CreateProductBodyDto) {
    return this.manageProductService.create(userId, body);
  }

  @Put(':productId')
  @ZodSerializerDto(UpdateProductResDto)
  update(
    @ActiveUser() activeUser: AccessTokenPayload,
    @Param() param: GetProductDetailParamDto,
    @Body() body: UpdateProductBodyDto,
  ) {
    return this.manageProductService.update({
      requestRoleName: activeUser.roleName,
      body,
      productId: param.productId,
      updatedById: activeUser.userId,
    });
  }

  @Delete(':productId')
  @ZodSerializerDto(MessageResDto)
  delete(@ActiveUser() activeUser: AccessTokenPayload, @Param() param: GetProductDetailParamDto) {
    return this.manageProductService.delete({
      deletedById: activeUser.userId,
      productId: param.productId,
      requestRoleName: activeUser.roleName,
    });
  }
}
