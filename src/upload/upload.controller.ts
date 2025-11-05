import { BadRequestException, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors,Delete,Param, Body } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor,FilesInterceptor} from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor (private readonly uploadService: UploadService){}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    // Upload to Cloudinary
    const cloudinaryResult = await this.uploadService.uploadImage(file);
    // Save to database
    const uploadRecord = await this.uploadService.saveToDatabase(cloudinaryResult);
    
    return {
      message: 'File uploaded successfully',
      cloudinary: cloudinaryResult,
      upload: uploadRecord,
    };
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided for upload');

    }
    if (files.length>10){
      throw new BadRequestException('maximum 10 files are allowed');
    }
    return this.uploadService.uploadMultipleImage(files)
  }
  @Delete(':id')
  async deleteUpload(@Param('id') id: string) {
    await this.uploadService.deleteUpload(id);
    return { message: 'Upload deleted successfully' };
  }

  @Delete('multiple')
  async deleteMultipleUploads(@Body() { uploadIds }: { uploadIds: string[] }) {
    const result = await this.uploadService.deleteMultipleUploads(uploadIds);
    return {
      message: 'Bulk deletion completed',
      successCount: result.successCount,
      failedDeletions: result.failedDeletions,
    };
  }
}
