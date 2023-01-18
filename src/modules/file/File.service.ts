import { BadRequestException, Injectable } from '@nestjs/common';
import config from 'src/config';
import s3 from 'src/infra/s3';

@Injectable()
export class FileService {
  async create(file: FileRequest): Promise<FileResponse> {
    try {
      const signedUrl = s3.getSignedUrl('putObject', {
        Bucket: config.aws.bucket,
        Key: file.fileName,
        ContentType: file.contentType
      });
      return {
        url: signedUrl,
        ...file,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error on create file url signed');
    }
  }

  async find(file: FileRequest): Promise<FileResponse> {
    try {
      const signedUrl = s3.getSignedUrl('getObject', {
        Bucket: config.aws.bucket,
        Key: file.fileName,
      });
      return {
        url: signedUrl,
        ...file,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error on find file url signed');
    }
  }

  async remove(fileName: string): Promise<any> {
    try {
      console.log(fileName)
      s3.deleteObject({ Bucket: config.aws.bucket, Key: fileName }, (err, data) => {
        if (err) throw new Error(err.message)
        console.log(err, data, config.aws.bucket)
      });
      return { success: true };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error on find file url signed');
    }
  }
}
