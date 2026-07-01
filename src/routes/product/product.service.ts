import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ProductNotFoundException } from 'src/routes/product/product.error';
import { GetListProductQueryType } from 'src/routes/product/product.model';
import { ProductRepository } from 'src/routes/product/product.repository';
import { isNotFoundPrismaError } from 'src/shared/utils';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  list(query: GetListProductQueryType) {
    return this.productRepository.getListProduct(
      {
        ...query,
        isPublic: true,
      },
      I18nContext.current()?.lang as string,
    );
  }

  async getDetailById(productId: number) {
    try {
      return await this.productRepository.getDetailById({
        productId,
        languageId: I18nContext.current()?.lang as string,
        isPublic: true,
      });
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw ProductNotFoundException;
      }

      throw error;
    }
  }
}
