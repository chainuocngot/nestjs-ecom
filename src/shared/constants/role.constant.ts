export const RoleName = {
  Admin: 'ADMIN',
  Seller: 'SELLER',
  Client: 'CLIENT',
} as const;

export type RoleNameType = (typeof RoleName)[keyof typeof RoleName];
