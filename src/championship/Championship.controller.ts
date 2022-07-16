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
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Championship } from './Championship.entity';
import { ChampionshipService } from './Championship.service';
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

  @Get(`${urlBase}/:id`)
  @Roles(Role.Admin)
  async findOne(@Param('id') id: string): Promise<Championship> {
    return await this.championshipService.findOne({ id });
  }

  @Post(`${urlBase}`)
  @Roles(Role.Admin)
  async createChampionship(
    @Body() payload: Championship,
    @Request() req: any,
  ): Promise<Championship> {
    return await this.championshipService.create(payload, req.user?.id);
  }

  @Post(`${urlBase}/:id`)
  @Roles(Role.Admin)
  async editChampionships(
    @Param('id') id: string,
    @Body() payload: Championship,
    @Request() req: any,
  ): Promise<object> {
    return await this.championshipService.edit(
      id,
      payload as object,
      req.user?.id,
    );
  }

  @Delete(`${urlBase}/:id`)
  @Roles(Role.Admin)
  async removeChampionship(@Param('id') id: string): Promise<object> {
    return await this.championshipService.remove(id);
  }
}
