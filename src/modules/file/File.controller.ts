import { RolesGuard } from '../../infra/role.guard';
import { Roles } from '../../infra/role.decorators';
import { Role } from '../../infra/role.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { FileService } from './File.service';
const urlBase = '/file';

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(`${urlBase}/:fileName`)
  async findOne(@Param('fileName') fileName: string): Promise<FileResponse> {
    return await this.fileService.find({ fileName });
  }

  @Post(`${urlBase}`)
  async createFile(@Body() payload: FileRequest): Promise<FileResponse> {
    return await this.fileService.create(payload);
  }

  @Delete(`${urlBase}/:fileName`)
  async removeFile(@Param('fileName') fileName: string): Promise<any> {
    return await this.fileService.remove(fileName);
  }
}