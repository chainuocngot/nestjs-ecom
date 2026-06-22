import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';

export const RoleNotFoundException = new NotFoundException('Error.RoleNotFound');

export const RoleAlreadyExistsException = new ConflictException('Error.RoleAlreadyExists');

export const ProhibitedActionOnBaseRoleException = new ForbiddenException('Error.ProhibitedActionOnBaseRole');
