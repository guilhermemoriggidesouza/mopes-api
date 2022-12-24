import { BadGatewayException, Dependencies, Injectable } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import config from 'src/config';
import s3 from 'src/infra/s3';
import { Repository } from 'typeorm';

@Injectable()
@Dependencies(getRepositoryToken(File))
export class FileService {
  async create(file: FileRequest): Promise<FileResponse> {
    try {
      const signedUrl = s3.getSignedUrl('putObject', {
        Bucket: config.aws.bucket,
        Key: file.fileName,
      });
      return {
        url: signedUrl,
        ...file,
      };
    } catch (error) {
      throw new BadGatewayException('Error on create file url signed');
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
      throw new BadGatewayException('Error on find file url signed');
    }
  }

  async remove(fileName: string): Promise<any> {
    try {
      s3.deleteObject({ Bucket: config.aws.bucket, Key: fileName });
      return { success: true };
    } catch (error) {
      throw new BadGatewayException('Error on find file url signed');
    }
  }
}
