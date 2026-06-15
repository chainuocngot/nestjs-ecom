import { Body, Controller, Post } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { RegisterBodyDto, RegisterResDto, SendOtpBodyDto } from 'src/auth/auth.dto';
import { AuthService } from 'src/auth/auth.service';

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
}
