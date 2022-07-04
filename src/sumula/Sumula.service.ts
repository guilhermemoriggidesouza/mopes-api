import { PlayerService } from './../player/Player.service';
import { PlayerInMatch } from 'src/sumula/entities/PlayerInMatch.entity';
import { StatusGamePeriod } from './entities/StatusGamePeriod.entity';
import { Team } from 'src/team/Team.entity';
import { Dependencies, Injectable, BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sumula } from './entities/Sumula.entity';

@Injectable()
@Dependencies(getRepositoryToken(Sumula))
export class SumulaService {

    constructor(
        private readonly sumulaRepository: Repository<Sumula>,
        private readonly playerInMatchRepository: Repository<PlayerInMatch>,
        private readonly statusGamePeriodsRepository: Repository<StatusGamePeriod>,
        private readonly playerService: PlayerService
    ) { }

    async create(Sumula: Sumula, ownerId: number): Promise<Sumula> {
        return this.sumulaRepository.save({ ...Sumula, ownerId })
    }

    async findAll(): Promise<Sumula[]> {
        return this.sumulaRepository.find();
    }

    async findOne({ id, where }: { id?: string, where?: object }): Promise<Sumula> {
        return this.sumulaRepository.findOne(id, { where, relations: ['teams', 'championship', 'championship.category', 'PlayerInMatchs', "playersInGame"] });
    }

    buildStatusTeam(teams: Team[], playerInMatchs: PlayerInMatch[], pointsPerTeam: boolean): team[] {
        return teams.map(teamItem => {
            const playersOfTeam = playerInMatchs.filter(playerInMatch => playerInMatch.teamId == teamItem.id)
            const points = pointsPerTeam ? playersOfTeam[0].point : playersOfTeam.map(player => player.point).reduce((currentValue, previousValue) => currentValue + previousValue)
            return {
                name: teamItem.name,
                points: points,
                faults: playersOfTeam.map(player => player.fault).reduce((currentValue, previousValue) => currentValue + previousValue)
            }
        })
    }

    getPointsByTeamInPeriod(statusGame: StatusGamePeriod[], teams: Team[]): number {
        const eachTeamPoints = teams.map(team => {
            const teamPoint = statusGame.find(stats => stats.teamId == team.id)
            return teamPoint.point
        })
        return eachTeamPoints.reduce((cv, pv) => cv + pv)
    }

    buildStatusPeriod(periods: number, statusGame: StatusGamePeriod[], pointsPerTeam: boolean, teams: Team[]): periodInfos[] {
        return Array(periods).map(periodNumber => {
            const period = statusGame.filter(stats => stats.period == periodNumber)
            const points = pointsPerTeam ? this.getPointsByTeamInPeriod(period, teams) : period.map(stats => stats.point).reduce((cv, pv) => cv + pv)
            return {
                points: points,
                faults: period.map(stats => stats.fault).reduce((cv, pv) => cv + pv)
            }
        })
    }

    async getGameStatus({ id }: { id: string }): Promise<gameStatus> {
        const sumulaInfos = await this.sumulaRepository.findOne(id, { relations: ['teams', 'championship', 'championship.category', 'playerInMatchs', 'statusGamePeriod'] });
        return {
            ...sumulaInfos,
            teams: this.buildStatusTeam(sumulaInfos.teams, sumulaInfos.playerInMatchs, sumulaInfos.championship.category.pointsPerTeam),
            periods: this.buildStatusPeriod(sumulaInfos.actualPeriod, sumulaInfos.statusGamePeriod, sumulaInfos.championship.category.pointsPerTeam, sumulaInfos.teams)
        } as gameStatus
    }

    async remove(id: string): Promise<object> {
        return await this.sumulaRepository.delete(id);
    }

    async edit(id: string, payload: object): Promise<object> {
        return await this.sumulaRepository.update(id, payload);
    }

    async addInteraction(interaction: string, payload: any, id: string): Promise<object> {
        const sumulaInfos = await this.findOne({ id })
        const updatePlayersInMatch = await this.playerInMatchRepository
            .increment({ sumulaId: parseInt(id), teamId: payload.teamId, playerId: payload.playerId }, interaction, payload.data[interaction])
            .then(response => response.raw);
        return await Promise.all(updatePlayersInMatch.map(async (player) => {
            return await this.statusGamePeriodsRepository.save({
                playerInMatchId: player.id,
                sumulaId: id,
                teamId: payload.teamId,
                ...payload.data,
                period: sumulaInfos.actualPeriod
            })
        }))
    }

    async updatePlayerPointInMatch(id: string, payload: pointingSumula): Promise<object> {
        return await this.addInteraction("point", payload, id)
    }
    async updatePlayerFaultInMatch(id: string, payload: faultingSumula): Promise<object> {
        return await this.addInteraction("fault", payload, id)
    }

    async removePlayerStatus(statusIds: string[]): Promise<any> {
        const status = await this.statusGamePeriodsRepository.findByIds(statusIds)
        status.map(async (status) => {
            if (status.point > 0) {
                await this.playerInMatchRepository.decrement({ id: status.playerInMatchId }, "point", status.point)
            }
            if (status.fault > 0) {
                await this.playerInMatchRepository.decrement({ id: status.playerInMatchId }, "fault", status.fault)
            }
            return await this.statusGamePeriodsRepository.delete({
                id: status.id,
            });
        })
    }

    async findAllPlayerInMatch(id: string): Promise<PlayerInMatch[]> {
        return await this.playerInMatchRepository.find({
            sumulaId: parseInt(id)
        })
    }

    async addingPlayerInMatch(id: string, payload: any): Promise<object> {
        const { championship: { category } } = await this.sumulaRepository.findOne(id, { relations: ['championship', 'championship.category'] });
        const player = await this.playerService.findOne({ id: payload.playerId });
        if (player.infractions == category.maxFaultsPerPlayer) {
            throw new BadRequestException("Error player cannot be insert game")
        }
        return await this.playerInMatchRepository.save({
            sumulaId: parseInt(id),
            ...payload
        });
    }

}