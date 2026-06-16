import { randomInt } from 'crypto';
import { Prisma } from 'src/generated/prisma/client';

export const isUniqueConstraintPrismaError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';

export const isNotFoundPrismaError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2018';

export const generateOtp = () => randomInt(100_000, 1_000_000).toString();
