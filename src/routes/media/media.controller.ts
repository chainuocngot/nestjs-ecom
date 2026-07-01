import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { type Response } from 'express';
import path from 'path';
import { envConfig } from 'src/shared/config';
import { REGEX_IMAGE_FILE_TYPE, UPLOAD_DIR } from 'src/shared/constants/media.constant';
import { isPublic } from 'src/shared/decorators/auth.decorator';

@Controller('media')
export class MediaController {
  @Post('images/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
          new FileTypeValidator({ fileType: REGEX_IMAGE_FILE_TYPE, skipMagicNumbersValidation: true }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return {
      url: `${envConfig.PREFIX_STATIC_ENDPOINT}/${file.filename}`,
    };
  }

  @Post('images/upload/multiple')
  @UseInterceptors(FilesInterceptor('files', 2))
  uploadFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: REGEX_IMAGE_FILE_TYPE, skipMagicNumbersValidation: true }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return files.map((file) => ({
      url: `${envConfig.PREFIX_STATIC_ENDPOINT}/${file.filename}`,
    }));
  }

  @Get('static/:filename')
  @isPublic()
  serveFile(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(path.join(UPLOAD_DIR, filename), (error) => {
      if (error) {
        const notFound = new NotFoundException('File không tồn tại');
        res.status(notFound.getStatus()).json(notFound.getResponse());
      }
    });
  }
}
