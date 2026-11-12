import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/modules/auth/guards/optional-jwt-auth.guard';
import { FileService } from './File.service';
const urlBase = '/file';

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Get(`${urlBase}/:fileName`)
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('fileName') fileName: string): Promise<FileResponse> {
    return await this.fileService.find({ fileName: decodeURIComponent(fileName) });
  }

  // Sem login é permitido só para o cadastro público (/sign), que sobe
  // foto de perfil e documento antes do usuário existir.
  @Post(`${urlBase}`)
  @UseGuards(OptionalJwtAuthGuard)
  async createFile(
    @Body() payload: FileRequest,
    @Request() req: any,
  ): Promise<FileResponse> {
    return await this.fileService.create(payload, !!req.user);
  }

  @Delete(`${urlBase}/:fileName`)
  @UseGuards(JwtAuthGuard)
  async removeFile(@Param('fileName') fileName: string): Promise<any> {
    return await this.fileService.remove(decodeURIComponent(fileName));
  }
}
