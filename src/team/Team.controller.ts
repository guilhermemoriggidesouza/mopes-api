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
import { Team } from './Team.entity';
import { TeamService } from './Team.service';
const urlBase: string = '/team';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get(`${urlBase}`)
  @Roles(Role.Admin)
  async findAllTeams(@Request() req: any): Promise<Team[]> {
    return await this.teamService.findAll({ orgId: req.user.orgId });
  }

  @Get(`${urlBase}/:id`)
  @Roles(Role.Admin)
  async findOne(@Param('id') id: string): Promise<Team> {
    return await this.teamService.findOne({ id });
  }

  @Get(`${urlBase}/:championshipId/relatory`)
  @Roles(Role.Admin)
  async findTableGame(
    @Param('championshipId') championshipId: string,
  ): Promise<tableGame> {
    return await this.teamService.findTableGame({ championshipId });
  }

  @Post(`${urlBase}`)
  @Roles(Role.Admin)
  async createTeam(@Body() payload: Team, @Request() req: any): Promise<Team> {
    return await this.teamService.create(payload, req.user.id, req.user.orgId);
  }

  @Put(`${urlBase}/:id`)
  @Roles(Role.Coach, Role.Admin)
  async editTeams(
    @Param('id') id: string,
    @Body() payload: Team,
    @Request() req: any,
  ): Promise<any> {
    return await this.teamService.edit(id, payload as any, req.user.orgId);
  }

  @Delete(`${urlBase}/:id`)
  @Roles(Role.Coach, Role.Admin)
  async removeTeam(@Param('id') id: string): Promise<any> {
    return await this.teamService.remove(id);
  }
}
