import { PaymentStatus } from 'src/shared/constants/payment.constant';
import { z } from 'zod';

export const PaymentSchema = z.object({
  id: z.number().int(),
  status: z.enum(PaymentStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const PaymentTransactionSchema = z.object({
  id: z.number().int(),
  gateway: z.string(),
  transactionDate: z.date(),
  accountNumber: z.string().nullable(),
  subAccount: z.string().nullable(),
  amountIn: z.number().int(),
  amountOut: z.number().int(),
  accumulated: z.number().int(),
  code: z.string().nullable(),
  transactionContent: z.string().nullable(),
  referenceNumber: z.string().nullable(),
  body: z.string().nullable(),
  createdAt: z.date(),
});

export const WebhookPaymentBodySchema = z.object({
  id: z.number().int(),
  gateway: z.string(),
  transactionDate: z.string(),
  accountNumber: z.string().nullable(),
  subAccount: z.string().nullable(),
  code: z.string().nullable(),
  content: z.string().nullable(),
  transferType: z.enum(['in', 'out']),
  description: z.string(),
  transferAmount: z.number().int(),
  accumulated: z.number().int(),
  referenceCode: z.string(),
});
