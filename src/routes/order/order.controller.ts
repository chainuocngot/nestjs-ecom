import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { GetListBrandQueryDto } from 'src/routes/brand/brand.dto';
import {
  CancelOrderResDto,
  CreateOrderBodyDto,
  CreateOrderResDto,
  GetListOrderResDto,
  GetOrderDetailParamDto,
  GetOrderDetailResDto,
} from 'src/routes/order/order.dto';
import { OrderService } from 'src/routes/order/order.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ZodSerializerDto(GetListOrderResDto)
  list(@ActiveUser('userId') userId: number, @Query() query: GetListBrandQueryDto) {
    return this.orderService.list({
      ...query,
      userId,
    });
  }

  @Post()
  @ZodSerializerDto(CreateOrderResDto)
  create(@ActiveUser('userId') userId: number, @Body() body: CreateOrderBodyDto) {
    return this.orderService.create(userId, body);
  }

  @Get(':orderId')
  @ZodSerializerDto(GetOrderDetailResDto)
  findById(@ActiveUser('userId') userId: number, @Param() param: GetOrderDetailParamDto) {
    return this.orderService.findById(userId, param.orderId);
  }

  @Put()
  @ZodSerializerDto(CancelOrderResDto)
  cancelOrder(@ActiveUser('userId') userId: number, @Param() param: GetOrderDetailParamDto) {
    return this.orderService.cancelOrder(userId, param.orderId);
  }
}
