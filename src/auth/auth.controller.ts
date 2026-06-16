import { Body, Controller, Ip, Post } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { LoginBodyDto, LoginResDto, RegisterBodyDto, RegisterResDto, SendOtpBodyDto } from 'src/auth/auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserAgent } from 'src/shared/decorators/user-agent.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodSerializerDto(RegisterResDto)
  register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body);
  }

  @Post('otp')
  sendOtp(@Body() body: SendOtpBodyDto) {
    return this.authService.sendOtp(body);
  }

  @Post('login')
  @ZodSerializerDto(LoginResDto)
  login(@Body() body: LoginBodyDto, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.login({ ...body, userAgent, ip });
  }
}
