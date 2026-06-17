import { ConflictException, NotFoundException } from '@nestjs/common';

export const PermissionNotFoundException = new NotFoundException('Error.PermissionNotFound');

export const PermissionAlreadyExistsException = new ConflictException('Error.PermissionAlreadyExists');
