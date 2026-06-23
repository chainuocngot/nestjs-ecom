import { NotFoundException } from '@nestjs/common';

export const UserNotFoundException = new NotFoundException('Error.UserNotFound');

export const RoleNotFoundException = new NotFoundException('Error.RoleNotFound');
