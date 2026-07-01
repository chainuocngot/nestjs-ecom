import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from 'src/routes/product/product.repository';
import { ManageProductService } from 'src/routes/product/manage-product.service';
import { ManageProductController } from 'src/routes/product/manage-product.controller';

@Module({
  controllers: [ProductController, ManageProductController],
  providers: [ProductService, ManageProductService, ProductRepository],
})
export class ProductModule {}
