import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import {
  AccessTokenPayload,
  AccessTokenPayloadCreate,
  RefreshTokenPayload,
  RefreshTokenPayloadCreate,
} from 'src/shared/types/jwt.type';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async signAccessToken(payload: AccessTokenPayloadCreate): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as JwtSignOptions['expiresIn'],
      algorithm: 'HS256',
    });
  }

  async signRefreshToken(payload: RefreshTokenPayloadCreate): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION as JwtSignOptions['expiresIn'],
      algorithm: 'HS256',
    });
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      algorithms: ['HS256'],
    });
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      algorithms: ['HS256'],
    });
  }
}
