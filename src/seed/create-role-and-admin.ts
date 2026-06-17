import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
import { HashingService } from 'src/shared/services/hashing.service';
import { RoleName } from 'src/shared/constants/role.constant';
import { envConfig } from 'src/shared/config';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const hashingService = new HashingService();

async function main() {
  const roleCount = await prisma.role.count();
  if (roleCount > 0) {
    throw new Error('Roles already exist');
  }

  const roles = await prisma.role.createMany({
    data: [
      { name: RoleName.Admin, description: 'Admin role' },
      { name: RoleName.Seller, description: 'Seller role' },
      { name: RoleName.Client, description: 'Client role' },
    ],
  });
  const adminRole = await prisma.role.findFirstOrThrow({
    where: { name: RoleName.Admin },
  });
  const hashedPassword = await hashingService.hash(envConfig.ADMIN_PASSWORD);
  const adminUser = await prisma.user.create({
    data: {
      email: envConfig.ADMIN_EMAIL,
      password: hashedPassword,
      name: envConfig.ADMIN_NAME,
      phoneNumber: envConfig.ADMIN_PHONE_NUMBER,
      roleId: adminRole.id,
    },
  });

  return {
    createdRoleCount: roles.count,
    adminUser,
  };
}

main()
  .then(async ({ adminUser, createdRoleCount }) => {
    console.log('Seed result:', { adminUser, createdRoleCount });
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
