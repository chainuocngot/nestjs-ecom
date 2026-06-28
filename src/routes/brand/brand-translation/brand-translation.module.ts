import { Module } from '@nestjs/common';
import { BrandTranslationController } from './brand-translation.controller';
import { BrandTranslationService } from './brand-translation.service';
import { BrandTranslationRepository } from 'src/routes/brand/brand-translation/brand-translation.repository';

@Module({
  controllers: [BrandTranslationController],
  providers: [BrandTranslationService, BrandTranslationRepository],
})
export class BrandTranslationModule {}
