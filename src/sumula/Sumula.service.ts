import { Team } from 'src/team/Team.entity';
import { PlayerInMatch } from './entities/PlayerInMatch.entity';
import { Dependencies, Injectable } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sumula } from './entities/Sumula.entity';

@Injectable()
@Dependencies(getRepositoryToken(Sumula))
export class SumulaService {

    constructor(
        private readonly sumulaRepository: Repository<Sumula>,
        private readonly PlayerInMatch: Repository<PlayerInMatch>,
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
                faults: 0
            }
        })
    }

    async getGameStatus({ id }: { id: string }): Promise<gameStatus> {
        const sumulaInfos = await this.sumulaRepository.findOne(id, { relations: ['teams', 'championship', 'championship.category', 'playerInMatchs', 'periods'] });
        return {
            ...sumulaInfos,
            teams: this.buildStatusTeam(sumulaInfos.teams, sumulaInfos.playerInMatchs, sumulaInfos.championship.category.pointsPerTeam),
        } as gameStatus
    }

    async remove(id: string): Promise<object> {
        return await this.sumulaRepository.delete(id);
    }

    async edit(id: string, payload: object): Promise<object> {
        return await this.sumulaRepository.update(id, payload);
    }

    async updatePlayerInMatch(id: string, payload: pointingSumula | faultingSumula): Promise<object> {
        return await this.PlayerInMatch.update({ teamId: payload.teamId, playerId: payload.playerId }, {
            ...payload.data
        });
    }

    async removePlayerInMatch(PlayerInMatchId: string): Promise<object> {
        return await this.PlayerInMatch.delete({
            id: parseInt(PlayerInMatchId),
        });
    }

    async findAllPlayerInMatch(id: string): Promise<PlayerInMatch[]> {
        return await this.PlayerInMatch.find({
            sumulaId: parseInt(id)
        })
    }

    async addingPlayerInMatch(id: string, payload: object): Promise<object> {
        return await this.PlayerInMatch.save({
            sumulaId: parseInt(id),
            ...payload
        });
    }

}
