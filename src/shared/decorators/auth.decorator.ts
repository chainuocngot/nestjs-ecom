import { SetMetadata } from '@nestjs/common';
import { AuthType, ConditionGuard, ConditionGuardType, TypeOfAuthType } from 'src/shared/constants/auth.constant';

export const AUTH_TYPE_KEY = 'authType';

export type AuthTypeDecoratorPayload = {
  authTypes: TypeOfAuthType[];
  options: {
    condition: ConditionGuardType;
  };
};

export const Auth = (authTypes: TypeOfAuthType[], options?: { condition: ConditionGuardType }) => {
  const defaultOptions = { condition: ConditionGuard.And };
  return SetMetadata(AUTH_TYPE_KEY, {
    authTypes,
    options: { ...defaultOptions, ...options },
  });
};

export const isPublic = () => Auth([AuthType.None]);
