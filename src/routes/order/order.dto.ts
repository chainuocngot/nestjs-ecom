import { createZodDto } from 'nestjs-zod';
import {
  OrderSchema,
  ProductSKUSnapshotSchema,
  GetListOrderQuerySchema,
  GetListOrderResSchema,
  GetOrderDetailResSchema,
  CreateOrderBodySchema,
  CreateOrderResSchema,
  CancelOrderResSchema,
  GetOrderDetailParamSchema,
} from 'src/routes/order/order.model';

export class OrderDto extends createZodDto(OrderSchema) {}

export class ProductSKUSnapshotDto extends createZodDto(ProductSKUSnapshotSchema) {}

export class GetListOrderQueryDto extends createZodDto(GetListOrderQuerySchema) {}

export class GetListOrderResDto extends createZodDto(GetListOrderResSchema) {}

export class GetOrderDetailResDto extends createZodDto(GetOrderDetailResSchema) {}

export class CreateOrderBodyDto extends createZodDto(CreateOrderBodySchema) {}

export class CreateOrderResDto extends createZodDto(CreateOrderResSchema) {}

export class CancelOrderResDto extends createZodDto(CancelOrderResSchema) {}

export class GetOrderDetailParamDto extends createZodDto(GetOrderDetailParamSchema) {}
