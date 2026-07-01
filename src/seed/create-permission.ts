import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from 'src/app.module';
import { HTTPMethod } from 'src/generated/prisma/enums';
import { RoleName, RoleNameType } from 'src/shared/constants/role.constant';
import { PrismaService } from 'src/shared/services/prisma.service';

const SELLER_MODULE = ['AUTH', 'MEDIA', 'MANAGE-PRODUCT', 'PRODUCT-TRANSLATION', 'PROFILE'];

const prisma = new PrismaService();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(4000);
  const server = app.getHttpAdapter().getInstance();
  const router = server.router;

  const permissionsInDb = await prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  });

  const availableRoutes: { path: string; method: HTTPMethod; name: string; module: string }[] = router.stack
    .map((layer) => {
      if (layer.route) {
        const method = String(layer.route?.stack[0].method).toUpperCase() as HTTPMethod;
        const path = layer.route?.path;
        const module = String(path.split('/')[1]).toUpperCase();
        return {
          name: `${method} ${path}`,
          path,
          method,
          module,
        };
      }
    })
    .filter((item) => item !== undefined);

  const permissionsInDbMap = permissionsInDb.reduce((acc, cur) => {
    acc[`${cur.method} ${cur.path}`] = cur;
    return acc;
  }, {});

  const availableRoutesMap = availableRoutes.reduce((acc, cur) => {
    acc[`${cur.method} ${cur.path}`] = cur;
    return acc;
  }, {});

  const permissionsToDelete = permissionsInDb.filter((item) => {
    return !availableRoutesMap[`${item.method} ${item.path}`];
  });

  if (permissionsToDelete.length > 0) {
    const deleteResult = await prisma.permission.deleteMany({
      where: {
        id: {
          in: permissionsToDelete.map((item) => item.id),
        },
      },
    });
    console.log('Deleted permissions: ', deleteResult);
  } else {
    console.log('No permission to delete');
  }

  const routesToAdd = availableRoutes.filter((item) => {
    return !permissionsInDbMap[`${item.method} ${item.path}`];
  });

  if (routesToAdd.length > 0) {
    const addResult = await prisma.permission.createMany({
      data: routesToAdd,
    });
    console.log('Added routes: ', addResult);
  } else {
    console.log('No permission to add');
  }

  const updatedPermissionsInDb = await prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  });

  const adminPermissionIds = updatedPermissionsInDb.map((item) => ({ id: item.id }));
  await updateRole(RoleName.Admin, adminPermissionIds);

  const sellerPermissionIds = updatedPermissionsInDb
    .filter((item) => SELLER_MODULE.includes(item.module))
    .map((item) => ({ id: item.id }));
  await updateRole(RoleName.Seller, sellerPermissionIds);

  process.exit(0);
}

const updateRole = async (roleName: RoleNameType, permissionIds: { id: number }[]) => {
  const role = await prisma.role.findFirstOrThrow({
    where: {
      name: roleName,
      deletedAt: null,
    },
  });
  await prisma.role.update({
    where: {
      id: role.id,
    },
    data: {
      permissions: {
        set: permissionIds,
      },
    },
  });
};

bootstrap();
