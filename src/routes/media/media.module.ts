import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { createUploadDirIfNotExists, generateRandomFilename } from 'src/shared/utils';
import { UPLOAD_DIR } from 'src/shared/constants/media.constant';

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
export class MediaModule {
  constructor() {
    createUploadDirIfNotExists();
  }
}
