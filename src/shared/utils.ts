import { Prisma } from 'src/generated/prisma/client';

export const isUniqueConstraintPrismaError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
