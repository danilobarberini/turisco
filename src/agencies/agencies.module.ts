import { forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { randomBytes } from 'crypto';
import { AUTO_CONTENT_TYPE } from 'multer-s3';
import { AuthModule } from 'src/auth/auth.module';
import { PoiModule } from 'src/poi/poi.module';
import { AgenciesController } from './agencies.controller';
import { AgenciesService } from './agencies.service';
import { Agency } from './entities/agency.entity';
import AWS = require('aws-sdk');
import s3Storage = require('multer-s3');

@Module({
  imports: [
    SequelizeModule.forFeature([Agency]),
    forwardRef(() => PoiModule),
    forwardRef(() => AuthModule),
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
        bucket: 'guiaturisticoapi/agencies',
        contentType: AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
          const newName = randomBytes(8).toString('hex');
          cb(null, `${newName}-agency-profile`);
        },
      }),
    }),
  ],
  controllers: [AgenciesController],
  providers: [AgenciesService],
  exports: [AgenciesService],
})
export class AgenciesModule {}
