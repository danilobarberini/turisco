import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class FileuploadController {
  constructor() {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async uploadImage(@UploadedFile() file: Express.MulterS3.File) {
    const url = file.location;
    return url;
  }
}
