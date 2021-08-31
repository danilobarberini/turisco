import { forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';
import { randomBytes } from 'crypto';
import { AUTO_CONTENT_TYPE } from 'multer-s3';
import { CryptService } from 'src/auth/crypt.service';
import { CommentModule } from 'src/comments/comment.module';
import { PoiModule } from 'src/poi/poi.module';
import { AuthModule } from '../auth/auth.module';
import { Favorite } from './entities/favorites.entity';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import AWS = require('aws-sdk');
import multerS3 = require('multer-s3');

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    SequelizeModule.forFeature([Favorite]),
    forwardRef(() => AuthModule),
    forwardRef(() => CommentModule),
    forwardRef(() => PoiModule),
    MulterModule.register({
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/jpeg'
        ) {
          cb(null, true);
        } else {
          cb(new Error('File must be of types JPG, JPEG or PNG'), false);
        }
      },
      storage: multerS3({
        s3: new AWS.S3(),
        bucket: 'guiaturisticoapi/users',
        contentType: AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
          const newName = randomBytes(8).toString('hex');
          cb(null, `${newName}-user-profile`);
        },
      }),
    }),
  ],

  controllers: [UsersController],
  providers: [UsersService, CryptService],
  exports: [UsersService],
})
export class UsersModule {}
