import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  ChangePasswordBodyDto,
  GetProfileResDto,
  UpdateProfileBodyDto,
  UpdateProfileResDto,
} from 'src/routes/profile/profile.dto';
import { ProfileService } from 'src/routes/profile/profile.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDto } from 'src/shared/dtos/response.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ZodSerializerDto(GetProfileResDto)
  getProfile(@ActiveUser('userId') userId: number) {
    return this.profileService.getProfile(userId);
  }

  @Patch()
  @ZodSerializerDto(UpdateProfileResDto)
  updateProfile(@ActiveUser('userId') userId: number, @Body() body: UpdateProfileBodyDto) {
    return this.profileService.updateProfile(userId, body);
  }

  @Patch('/change-password')
  @ZodSerializerDto(MessageResDto)
  changePassword(@ActiveUser('userId') userId: number, @Body() body: ChangePasswordBodyDto) {
    return this.profileService.changePassword(userId, body);
  }
}
