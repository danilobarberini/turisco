import { FileuploadController } from './fileupload/fileupload.controller';
import { ChatModule } from './websocket/chat.module';
import { CommentModule } from './comments/comment.module';
import { PoiModule } from './poi/poi.module';
import { CategoryModule } from './categories/category.module';
import { DatabaseModule } from './database/database.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import multerS3 = require('multer-s3');
import AWS = require('aws-sdk');
import { AUTO_CONTENT_TYPE } from 'multer-s3';
import { randomBytes } from 'crypto';

@Module({
  imports: [
    DatabaseModule,
    ChatModule,
    CommentModule,
    PoiModule,
    CategoryModule,
    AuthModule,
    MulterModule.register({
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/gif' ||
          file.mimetype === 'video/mp4' ||
          file.mimetype === 'video/mpeg' ||
          file.mimetype === 'video/ogg' ||
          file.mimetype === 'video/webm' ||
          file.mimetype === 'video/x-msvideo' ||
          file.mimetype === 'video/x-ms-wmv'
        ) {
          cb(null, true);
        } else {
          cb(new Error('File must be of types JPG, JPEG or PNG'), false);
        }
      },
      storage: multerS3({
        s3: new AWS.S3(),
        bucket: 'guiaturisticoapi/rooms',
        acl: 'public-read',
        contentType: AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
          if (
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/gif'
          ) {
            const newName = randomBytes(8).toString('hex');
            cb(null, `${newName}-image-upload`);
          }
          if (
            file.mimetype === 'video/mp4' ||
            file.mimetype === 'video/mpeg' ||
            file.mimetype === 'video/ogg' ||
            file.mimetype === 'video/webm' ||
            file.mimetype === 'video/x-msvideo' ||
            file.mimetype === 'video/x-ms-wmv'
          ) {
            const newName = randomBytes(8).toString('hex');
            cb(null, `${newName}-video-upload`);
          }
        },
      }),
    }),
  ],
  controllers: [FileuploadController],
  providers: [],
})
export class AppModule {}
