import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import config from 'src/config';
import s3 from 'src/infra/s3';

// prefixos que o cadastro público pode usar sem estar logado
const ANONYMOUS_UPLOAD_PREFIXES = ['user/profile/', 'user/document/'];

@Injectable()
export class FileService {
  private assertAnonymousUploadAllowed(file: FileRequest) {
    const fileName = file.fileName || '';
    const allowedPrefix = ANONYMOUS_UPLOAD_PREFIXES.some((prefix) =>
      fileName.startsWith(prefix),
    );
    const isImage = (file.contentType || '').startsWith('image/');
    if (!allowedPrefix || !isImage || fileName.includes('..')) {
      throw new ForbiddenException('Upload not allowed without login');
    }
  }

  async create(file: FileRequest, authenticated: boolean): Promise<FileResponse> {
    if (!authenticated) {
      this.assertAnonymousUploadAllowed(file);
    }
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
