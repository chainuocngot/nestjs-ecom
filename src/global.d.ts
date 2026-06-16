import { AccessTokenPayload } from 'src/shared/types/jwt.type';

declare global {
  namespace Express {
    interface Request {
      user: AccessTokenPayload;
    }
  }
}

export {};
