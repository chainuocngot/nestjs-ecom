import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';
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
  @ZodResponse({ type: GetListOrderResDto })
  list(@ActiveUser('userId') userId: number, @Query() query: GetListBrandQueryDto) {
    return this.orderService.list({
      ...query,
      userId,
    });
  }

  @Post()
  @ZodResponse({ type: CreateOrderResDto })
  create(@ActiveUser('userId') userId: number, @Body() body: CreateOrderBodyDto) {
    return this.orderService.create(userId, body);
  }

  @Get(':orderId')
  @ZodResponse({ type: GetOrderDetailResDto })
  findById(@ActiveUser('userId') userId: number, @Param() param: GetOrderDetailParamDto) {
    return this.orderService.findById(userId, param.orderId);
  }

  @Put()
  @ZodResponse({ type: CancelOrderResDto })
  cancelOrder(@ActiveUser('userId') userId: number, @Param() param: GetOrderDetailParamDto) {
    return this.orderService.cancelOrder(userId, param.orderId);
  }
}
