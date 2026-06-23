import { randomInt } from 'crypto';
import path from 'path';
import { Prisma } from 'src/generated/prisma/client';
import { v4 as uuidv4 } from 'uuid';

export const isUniqueConstraintPrismaError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';

export const isForeignKeyConstraintPrismaError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003';

export const isNotFoundPrismaError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';

export const generateOtp = () => randomInt(100_000, 1_000_000).toString();

export const generateRandomFilename = (filename: string) => {
  console.log('>> Check | filename:', filename);
  const ext = path.extname(filename);
  console.log('>> Check | ext:', ext);

  return `${uuidv4()}${ext}`;
};
