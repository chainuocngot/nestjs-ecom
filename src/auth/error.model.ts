import { UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';

// OTP related errors
export const InvalidOtpException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidOtp',
    path: 'code',
  },
]);

export const OtpExpiredException = new UnprocessableEntityException([
  {
    message: 'Error.OtpExpired',
    path: 'code',
  },
]);

export const FailedToSendOtpException = new UnprocessableEntityException([
  {
    message: 'Error.FailedToSendOtp',
    path: 'code',
  },
]);

// Email related errors
export const EmailAlreadyExistsException = new UnprocessableEntityException([
  {
    message: 'Error.EmailAlreadyExists',
    path: 'email',
  },
]);

export const EmailNotFoundException = new UnprocessableEntityException([
  {
    message: 'Error.EmailNotFound',
    path: 'email',
  },
]);

export const IncorrectPasswordException = new UnprocessableEntityException([
  {
    message: 'Error.IncorrectPassword',
    path: 'password',
  },
]);

// Auth token related errors
export const RefreshTokenAlreadyUsedException = new UnauthorizedException('Error.RefreshTokenAlreadyUsed');
export const UnauthorizedAccessException = new UnauthorizedException('Error.UnauthorizedAccess');

// Google auth related errors
export const GoogleUserInfoError = new Error('Error.FailedToGetGoogleUserInfo');

export const InvalidTOtpException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidTOtp',
    path: 'totpCode',
  },
]);

export const TOtpAlreadyEnabledException = new UnprocessableEntityException([
  {
    message: 'Error.TOtpAlreadyEnabled',
    path: 'totpCode',
  },
]);

export const TOtpNotEnabledException = new UnprocessableEntityException([
  {
    message: 'Error.TOtpNotEnabled',
    path: 'totpCode',
  },
]);

export const InvalidTOtpAndCodeException = new UnprocessableEntityException([
  {
    message: 'Error.InvalidTOtpAndCode',
    path: 'totpCode',
  },
  {
    message: 'Error.InvalidTOtpAndCode',
    path: 'code',
  },
]);
