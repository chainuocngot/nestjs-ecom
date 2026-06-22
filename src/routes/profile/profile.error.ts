import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

export const ProfileNotFoundException = new NotFoundException('Error.ProfileNotFound');

export const IncorrectOldPasswordException = new UnprocessableEntityException([
  {
    message: 'Error.IncorrectOldPassword',
    path: 'oldPassword',
  },
]);
