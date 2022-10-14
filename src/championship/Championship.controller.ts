import { RolesGuard } from 'src/role.guard';
import { Roles } from '../role.decorators';
import { Role } from '../role.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Championship } from './entities/Championship.entity';
import { ChampionshipService } from './Championship.service';
import { ChampionshipKeys } from './entities/ChampionshipKeys.entity';
const urlBase: string = '/championship';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChampionshipController {
  constructor(private readonly championshipService: ChampionshipService) {}

  @Get(`${urlBase}`)
  @Roles(Role.Admin)
  async findAllChampionships(@Request() req: any): Promise<Championship[]> {
    return await this.championshipService.findAll({ ownerId: req.user?.id });
  }

  @Get(`championshipKeys`)
  @Roles(Role.Admin)
  async findAllChampionshipKeys(
    @Request() req: any,
  ): Promise<ChampionshipKeys[]> {
    return await this.championshipService.findAllChampionshipKeys();
  }

  @Get(`${urlBase}/:id`)
  @Roles(Role.Admin)
  async findOne(
    @Param('id') id: string,
    @Body() payload: Championship,
  ): Promise<Championship> {
    return await this.championshipService.findOne({ id, where: payload });
  }

  @Get(`${urlBase}/:id/start`)
  @Roles(Role.Admin)
  async start(@Param('id') id: string): Promise<any> {
    return await this.championshipService.startChampionship({ id });
  }

  @Post(`${urlBase}`)
  @Roles(Role.Admin)
  async createChampionship(
    @Body() payload: Championship,
    @Request() req: any,
  ): Promise<Championship> {
    return await this.championshipService.create(payload, req.user?.id);
  }

  @Put(`${urlBase}/:id`)
  @Roles(Role.Admin)
  async editChampionships(
    @Param('id') id: string,
    @Body() payload: Championship,
    @Request() req: any,
  ): Promise<any> {
    return await this.championshipService.edit(id, payload as any);
  }

  @Delete(`${urlBase}/:id`)
  @Roles(Role.Admin)
  async removeChampionship(@Param('id') id: string): Promise<any> {
    return await this.championshipService.remove(id);
  }
}
