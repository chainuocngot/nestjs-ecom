import { randomInt } from 'crypto';
import path from 'path';
import { Prisma } from 'src/generated/prisma/client';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { UPLOAD_DIR } from 'src/shared/constants/media.constant';

export const isUniqueConstraintPrismaError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';

export const isForeignKeyConstraintPrismaError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003';

export const isNotFoundPrismaError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';

export const generateOtp = () => randomInt(100_000, 1_000_000).toString();

export const generateRandomFilename = (filename: string) => {
  const ext = path.extname(filename);

  return `${uuidv4()}${ext}`;
};

export const createUploadDirIfNotExists = () => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, {
      recursive: true,
    });
  }
};
