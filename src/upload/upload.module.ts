import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { v2 as cloudinary } from 'cloudinary';
import * as multer from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './upload.entity';
import config from 'src/config/config';


@Module({
  imports: [
    TypeOrmModule.forFeature([Upload]),
    MulterModule.register({
      storage: multer.memoryStorage(),
      limits:{fileSize:5*1024*1024},
      fileFilter:(req,file,cb) => {
        const allowedMimes =['image/jpeg','image/png','image/gif'];
        const isAllowed = allowedMimes.includes(file.mimetype);
        cb(isAllowed? null : new Error ('Invalid file type'),isAllowed);//cb is callback
      }
    })
  ],
  providers: [
    {
      provide: 'CLOUDINAY_CONFIG',
      useFactory: () =>{
        cloudinary.config({
          cloud_name: config().cloudinary.cloudName,
          api_key: config().cloudinary.apiKey,
          api_secret: config().cloudinary.apiSecret,
          // cloud_name:process.env.CLOUDINARY_CLOUD_NAME || 'dfrb6f1sr',
          // api_key:process.env.CLOUDINARY_API_KEY || '123456789012345',
          // api_secret:process.env.CLOUDINARY_API_SECRET || 'M93Emu5npQ7jhDu5f_Gv-2SpJhY',
        })
      }
    },
    UploadService
  ],
  controllers: [UploadController]
})
export class UploadModule {}
