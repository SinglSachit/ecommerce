import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {v2 as cloudinary} from 'cloudinary';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from './upload.entity';
import { error } from 'console';

export interface CloudinaryResponse{
  public_id: string;
  secure_url: string;
  original_filename: string;
  bytes: number;
  format:string;
  width:number;
  height: number;
}

export interface MulterFile{
  path:string;
  mimetype:string;
  size:number;
 }

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
  ) {}
  // deleteImage(publicId: string) {
  //   throw new Error('Method not implemented.');
  // }
  async uploadImage(file:Express.Multer.File): Promise<CloudinaryResponse>{
    try{
      console.log('uploaded file buffer',file.buffer);
  
 return await new Promise((resolve,reject)=>{
  const strem = cloudinary.uploader.upload_stream(
    {folder:'uploads/images',resource_type:'auto'},
    (error,result)=>{
      if(error){
        reject(new Error(error.message || 'Upload failed'));
      }else{
        resolve(result as CloudinaryResponse);
      }
    }
  );
  strem.end(file.buffer);
 });
}catch(error){
  console.log(error)
  const message=error instanceof Error? error.message:"Upload failed";
  throw new InternalServerErrorException(`Upload Failed:${message}`)
}
  }
  async uploadMultipleImage(
    files:Express.Multer.File[],
 ):Promise<CloudinaryResponse[]> {
  try{
    const uploadPromises= files.map((file)=> this.uploadImage(file));
    return await Promise.all(uploadPromises)
  }catch{
    const message = error instanceof Error ? error.message:'Upload Failed';
    throw new InternalServerErrorException(`Upload failed:${message}`)
  }
 }

  async deleteImage(publicId:string):Promise<{result:string}>{
    try{
      return cloudinary.uploader.destroy(publicId) as Promise<{
        result: string;
      }>;
    } catch(error){
      const message = error instanceof Error ? error.message : 'Deletion Failed';
      throw new InternalServerErrorException(`Deletion failed:${message}`);
    }
  }

  async saveToDatabase(cloudinaryResult: CloudinaryResponse): Promise<Upload> {
    const upload = this.uploadRepository.create({
      publicId: cloudinaryResult.public_id,
      secureUrl: cloudinaryResult.secure_url,
      originalFilename: cloudinaryResult.original_filename,
      bytes: cloudinaryResult.bytes,
      format: cloudinaryResult.format,
      width: cloudinaryResult.width,
      height: cloudinaryResult.height,
    });

    return this.uploadRepository.save(upload);
  }

  async findUploadById(uploadId: string): Promise<Upload> {
    const upload = await this.uploadRepository.findOne({
      where: { id: uploadId },
    });
    if (!upload) {
      throw new NotFoundException(`Upload with ID ${uploadId} not found`);
    }
    return upload;
  }

  async deleteUpload(uploadId: string): Promise<void> {
    const upload = await this.findUploadById(uploadId);
    
    try {
      // Delete from Cloudinary
      await this.deleteImage(upload.publicId);
      
      // Delete from database
      await this.uploadRepository.remove(upload);
    } catch (error) {
      throw new Error(`Failed to delete upload: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteMultipleUploads(uploadIds: string[]): Promise<{
    successCount: number;
    failedDeletions: { id: string; error: string }[];
  }> {
    const results: { successCount: number; failedDeletions: { id: string; error: string }[] } = {
      successCount: 0,
      failedDeletions: [],
    };

    // Process each upload ID sequentially to handle errors individually
    for (const uploadId of uploadIds) {
      try {
        await this.deleteUpload(uploadId);
        results.successCount++;
      } catch (error) {
        results.failedDeletions.push({
          id: uploadId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }
}
// export class UploadService {
//   async uploadImage(file: Express.Multer.File): Promise<CloudinaryResponse>{
//     this.validateFile(file);
//     const result = await cloudinary.uploader.upload(file.path,{// is is done if we want to add through the folder that is saved in the disk
//       folder:'uploads/images',
//     });

//     return result;
//   }

//   validateFile(file:MulterFile):void{
//     const allowedMimeTypes =['image/jpeg','image/png','image/gif'];
//     const maxSizeInBytes = 5 * 1024 * 1024;
//     if (!allowedMimeTypes.includes(file.mimetype)){
//       throw new Error(
//         'invalid file type. Only JPEG,PNG,  and GIF are allowed.',
//       );
//     }
//      if (file.size >maxSizeInBytes){
//       throw new Error('file size exceed the 5MB limit');
//      }
//   }
// }
