import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async signAccessToken(payload: { userId: number }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as JwtSignOptions['expiresIn'],
      algorithm: 'HS256',
    });
  }

  async signRefreshToken(payload: { userId: number }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION as JwtSignOptions['expiresIn'],
      algorithm: 'HS256',
    });
  }

  async verifyAccessToken(token: string): Promise<{ userId: number }> {
    return this.jwtService.verifyAsync(token, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      algorithms: ['HS256'],
    });
  }

  async verifyRefreshToken(token: string): Promise<{ userId: number }> {
    return this.jwtService.verifyAsync(token, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      algorithms: ['HS256'],
    });
  }
}
