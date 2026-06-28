import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandRepository } from 'src/routes/brand/brand.repository';

@Module({
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
})
export class BrandModule {}
