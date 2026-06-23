import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import path from 'path';
import { generateRandomFilename } from 'src/shared/utils';

const UPLOAD_DIR = path.resolve('upload');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, generateRandomFilename(file.originalname));
  },
});

@Module({
  controllers: [MediaController],
  providers: [MediaService],
  imports: [
    MulterModule.register({
      storage,
    }),
  ],
})
export class MediaModule {}
