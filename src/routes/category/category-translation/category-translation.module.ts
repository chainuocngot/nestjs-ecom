import { Module } from '@nestjs/common';
import { CategoryTranslationController } from './category-translation.controller';
import { CategoryTranslationService } from './category-translation.service';
import { CategoryTranslationRepository } from 'src/routes/category/category-translation/category-translation.repository';

@Module({
  controllers: [CategoryTranslationController],
  providers: [CategoryTranslationService, CategoryTranslationRepository],
})
export class CategoryTranslationModule {}
