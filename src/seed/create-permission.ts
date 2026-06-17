import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from 'src/app.module';
import { HTTPMethod } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/shared/services/prisma.service';

const prisma = new PrismaService();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(4000);
  const server = app.getHttpAdapter().getInstance();
  const router = server.router;

  const availableRoutes: { path: string; method: HTTPMethod; name: string }[] = router.stack
    .map((layer) => {
      if (layer.route) {
        const method = String(layer.route?.stack[0].method).toUpperCase() as HTTPMethod;
        const path = layer.route?.path;
        return {
          name: `${method} ${path}`,
          path,
          method,
        };
      }
    })
    .filter((item) => item !== undefined);

  const result = await prisma.permission.createMany({
    data: availableRoutes,
    skipDuplicates: true,
  });

  console.log(result);

  process.exit(0);
}

bootstrap();
