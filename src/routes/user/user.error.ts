import { BadRequestException, ConflictException } from '@nestjs/common';

export const UserAlreadyExistsException = new ConflictException('Error.UserAlreadyExists');

export const CannotUpdateOrDeleteYourselfException = new BadRequestException('Error.CannotUpdateOrDeleteYourself');
