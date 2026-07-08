export const OrderBy = {
  Asc: 'asc',
  Desc: 'desc',
} as const;

export type OrderByType = (typeof OrderBy)[keyof typeof OrderBy];

export const SortBy = {
  Price: 'price',
  CreatedAt: 'createdAt',
  Sale: 'sale',
} as const;

export type SortByType = (typeof SortBy)[keyof typeof SortBy];

export const PREFIX_PAYMENT_CODE = 'DH';

export const PAYMENT_QUEUE_NAME = 'payment';
export const CANCEL_PAYMENT_JOB_NAME = 'cancel-payment';
