import { Controller, Get, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { GetListBrandQueryDto } from 'src/routes/brand/brand.dto';
import { GetListOrderResDto } from 'src/routes/order/order.dto';
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
}
