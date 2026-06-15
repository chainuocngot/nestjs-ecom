import fs from 'fs';
import path from 'path';
import z from 'zod';
import 'dotenv/config';

const envFilePath = path.resolve('.env');
if (!fs.existsSync(envFilePath)) {
  console.error('Không tìm thấy file .env. Vui lòng tạo file .env với các biến môi trường cần thiết.');
  process.exit(1);
}

const envConfigSchema = z.object({
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRATION: z.string(),
  ADMIN_EMAIL: z.email(),
  ADMIN_PASSWORD: z.string(),
  ADMIN_NAME: z.string(),
  ADMIN_PHONE_NUMBER: z.string(),
  OTP_EXPIRES_IN: z.string(),
});

const parsedEnvConfig = envConfigSchema.safeParse(process.env);

if (!parsedEnvConfig.success) {
  console.error('Các biến môi trường không hợp lệ:', parsedEnvConfig.error);
  process.exit(1);
}

export const envConfig = parsedEnvConfig.data;
