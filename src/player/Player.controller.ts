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
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Player } from './Player.entity';
import { PlayerService } from './Player.service';
const urlBase: string = '/player';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get(`${urlBase}`)
  @Roles(Role.Coach, Role.Admin)
  async findAllPlayers(): Promise<Player[]> {
    return await this.playerService.findAll();
  }

  @Get(`${urlBase}/:id`)
  @Roles(Role.Player, Role.Coach, Role.Admin)
  async findOne(@Param('id') id: string): Promise<Player> {
    return await this.playerService.findOne({ id });
  }

  @Put(`${urlBase}/:id`)
  @Roles(Role.Player, Role.Coach, Role.Admin)
  async editPlayers(
    @Param('id') id: string,
    @Body() payload: Player,
  ): Promise<any> {
    return await this.playerService.edit(id, payload as any);
  }

  @Delete(`${urlBase}/:id`)
  @Roles(Role.Coach, Role.Admin)
  async removePlayer(@Param('id') id: string): Promise<any> {
    return await this.playerService.remove({ id });
  }
}
