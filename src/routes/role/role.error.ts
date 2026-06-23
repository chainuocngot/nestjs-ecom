import { ConflictException, ForbiddenException } from '@nestjs/common';

export const RoleAlreadyExistsException = new ConflictException('Error.RoleAlreadyExists');

export const ProhibitedActionOnBaseRoleException = new ForbiddenException('Error.ProhibitedActionOnBaseRole');
