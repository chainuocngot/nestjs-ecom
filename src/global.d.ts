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
  }
}

export {};
