import { RolesGuard } from 'src/role.guard';
import { Roles } from '../role.decorators';
import { Role } from '../role.enum';
import { Body, Controller, Delete, Get, Param, Post, Req, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Team } from './Team.entity';
import { TeamService } from './Team.service';
const urlBase: string = "/team"

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamController {
    constructor(private readonly teamService: TeamService) { }
    
    @Get(`${urlBase}`)
    @Roles(Role.Admin)
    async findAllTeams(): Promise<Team[]> {
        return await this.teamService.findAll();
    }
    
    @Get(`${urlBase}/:id`)
    @Roles(Role.Admin)
    async findOne(@Param("id") id: string): Promise<Team> {
        return await this.teamService.findOne({ id });
    }
    
    @Post(`${urlBase}`)
    @Roles(Role.Admin)
    async createTeam(@Body() payload: Team, @Request() req: any): Promise<Team> {
        return await this.teamService.create(payload, req.user.id);
    }

    @Post(`${urlBase}/:id`)
    @Roles(Role.Coach, Role.Admin)
    async editTeams(@Param("id") id: string, @Body() payload: Team): Promise<object> {
        return await this.teamService.edit(id, (payload as object));
    }

    @Delete(`${urlBase}/:id`)
    @Roles(Role.Coach, Role.Admin)
    async removeTeam(@Param("id") id: string): Promise<object> {
        return await this.teamService.remove(id);
    }
}