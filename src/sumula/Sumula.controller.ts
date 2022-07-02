import { PlayerService } from './../player/Player.service';
import { PlayerInMatch } from 'src/sumula/entities/PlayerInMatch.entity';
import { RolesGuard } from 'src/role.guard';
import { Roles } from '../role.decorators';
import { Role } from '../role.enum';
import { Body, Controller, Delete, Get, Param, Post, Req, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Sumula } from './entities/Sumula.entity';
import { SumulaService } from './Sumula.service';
const urlBase: string = "/sumula"

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class SumulaController {
    constructor(
        private readonly sumulaService: SumulaService,
        private readonly playerService: PlayerService
    ) { }

    @Get(`${urlBase}`)
    @Roles(Role.Admin)
    async findAllSumulas(): Promise<Sumula[]> {
        return await this.sumulaService.findAll();
    }

    @Get(`${urlBase}/:id`)
    @Roles(Role.Admin)
    async findOne(@Param("id") id: string): Promise<object> {
        return await this.sumulaService.findOne({ id });
    }

    @Post(`${urlBase}`)
    @Roles(Role.Admin)
    async createSumula(@Body() payload: Sumula, @Request() req: any): Promise<Sumula> {
        return await this.sumulaService.create(payload, req.user?.id);
    }

    @Post(`${urlBase}/:id`)
    @Roles(Role.Admin)
    async editSumulas(@Param("id") id: string, @Body() payload: Sumula): Promise<object> {
        return await this.sumulaService.edit(id, (payload as object));
    }

    @Delete(`${urlBase}/:id`)
    @Roles(Role.Admin)
    async removeSumula(@Param("id") id: string): Promise<object> {
        return await this.sumulaService.remove(id);
    }

    @Post(`${urlBase}/:id/pointing`)
    @Roles(Role.Admin)
    async poitingSumula(@Param("id") id: string, @Body() payload: pointingSumula): Promise<object> {
        return await this.sumulaService.updatePlayerInMatch(id, payload);
    }

    @Post(`${urlBase}/:id/faulting`)
    @Roles(Role.Admin)
    async faultingSumula(@Param("id") id: string, @Body() payload: faultingSumula): Promise<object> {
        const interaction = await this.sumulaService.updatePlayerInMatch(id, payload);
        if (payload.makePerpetue && payload.playerId) {
            await this.playerService.addingFault(payload.playerId, payload.data.fault)
        }
        return interaction
    }

    @Delete(`${urlBase}/:id/player-in-match`)
    @Roles(Role.Admin)
    async removeInteration(@Param("id") id: string): Promise<object> {
        return await this.sumulaService.removePlayerInMatch(id);
    }

    @Get(`${urlBase}/:id/player-in-match`)
    @Roles(Role.Admin)
    async findAllInterations(@Param("id") id: string): Promise<PlayerInMatch[]> {
        return await this.sumulaService.findAllPlayerInMatch(id);
    }

    @Post(`${urlBase}/:id/player-in-match`)
    @Roles(Role.Admin)
    async addPlayerInMatch(@Param("id") id: string, @Body() payload: pointingSumula): Promise<object> {
        return await this.sumulaService.addingPlayerInMatch(id, payload);
    }

}
