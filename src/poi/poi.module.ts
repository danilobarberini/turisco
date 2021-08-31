import { forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { randomBytes } from 'crypto';
import { AUTO_CONTENT_TYPE } from 'multer-s3';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryModule } from 'src/categories/category.module';
import { CategoryPoiModule } from 'src/categoryPoi/categoryPoi.module';
import { AgenciesModule } from '../agencies/agencies.module';
import { POI } from './entities/poi.entity';
import { PoiController } from './poi.controller';
import { PoiService } from './poi.service';
import AWS = require('aws-sdk');
import s3Storage = require('multer-s3');

@Module({
  imports: [
    SequelizeModule.forFeature([POI]),
    forwardRef(() => AgenciesModule),
    forwardRef(() => AuthModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => CategoryPoiModule),
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
      storage: s3Storage({
        s3: new AWS.S3(),
        bucket: 'guiaturisticoapi/pois',
        contentType: AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
          const newName = randomBytes(12).toString('hex');
          cb(null, `${newName}-POI-image`);
        },
      }),
    }),
  ],
  controllers: [PoiController],
  providers: [PoiService],
  exports: [PoiService],
})
export class PoiModule {}
