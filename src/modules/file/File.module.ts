import { Module } from '@nestjs/common';
import { FileController } from './File.controller';
import { FileService } from './File.service';

@Module({
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
