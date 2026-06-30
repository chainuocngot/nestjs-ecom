import { Module } from '@nestjs/common';
import { ProductTranslationController } from './product-translation.controller';
import { ProductTranslationService } from './product-translation.service';
import { ProductTranslationRepository } from 'src/routes/product/product-translation/product-translation.repository';

@Module({
  controllers: [ProductTranslationController],
  providers: [ProductTranslationService, ProductTranslationRepository],
})
export class ProductTranslationModule {}
