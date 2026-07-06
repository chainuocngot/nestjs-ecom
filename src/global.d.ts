import { ProductTranslationType } from 'src/routes/product/product-translation/product-translation.model';
import { VariantsType } from 'src/routes/product/product.model';
import { AccessTokenPayload } from 'src/shared/types/jwt.type';

declare global {
  namespace Express {
    interface Request {
      user: AccessTokenPayload;
    }
  }

  namespace PrismaJson {
    type VariantsTypeJson = VariantsType;
    type ProductTranslationsTypeJson = Pick<ProductTranslationType, 'id' | 'name' | 'description' | 'languageId'>[];
    type ReceiverTypeJson = {
      name: string;
      phone: string;
      email: string;
    };
  }
}

export {};
