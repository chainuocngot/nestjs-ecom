import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Comment do không thiết lập được guard bằng cách này
  // app.useStaticAssets(UPLOAD_DIR, {
  //   prefix: '/media/static',
  // });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
