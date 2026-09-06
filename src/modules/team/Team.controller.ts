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
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Team } from './Team.entity';
import { TeamService } from './Team.service';
const urlBase = '/team';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  @Get(`${urlBase}`)
  @Roles(Role.Admin, Role.Player, Role.Coach)
  async findAllTeams(
    @Request() req: any,
    @Query('userId') userId?: string,
    @Query('role') role?: string,
    @Query('championshipId') championshipId?: string,
  ): Promise<Team[]> {
    if (userId && role) {
      return await this.teamService.findByUserRole(userId, role as Role, req.user.orgId);
    }

    if (championshipId) {
      return await this.teamService.findByChampionship(
        championshipId,
        req.user.orgId,
        req.user.role === Role.Coach ? req.user.id : undefined,
      );
    }

    return await this.teamService.findAll();
  }

  @Get(`${urlBase}/:id`)
  @Roles(Role.Admin, Role.Player, Role.Coach)
  async findOne(@Param('id') id: string): Promise<Team> {
    return await this.teamService.findOne({ id });
  }

  @Get(`${urlBase}/:championshipId/relatory`)
  @Roles(Role.Admin)
  async findTableGame(
    @Param('championshipId') championshipId: string,
    @Query('groupByKey') groupByKey: boolean,
  ): Promise<tableGame> {
    return await this.teamService.findTableGame({ championshipId, groupByKey });
  }

  @Post(`${urlBase}`)
  @Roles(Role.Admin, Role.Coach)
  async createTeam(@Body() payload: Team, @Request() req: any): Promise<Team> {
    return await this.teamService.create(payload, req.user, req.user.orgId);
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
