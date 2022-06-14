import { UserService } from 'src/user/User.service';
import { PlayerService } from './../player/Player.service';
import { Player } from 'src/player/Player.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './Team.entity';
import { User } from 'src/user/User.entity';

@Injectable()
export class TeamService {

    constructor(
        private playerService: PlayerService,
        private userService: UserService,
        @InjectRepository(Team)
        private teamRepository: Repository<Team>
    ) { }

    async create(Team: Team, creatorId: number): Promise<Team> {
        return this.teamRepository.save({ ...Team, creatorId })
    }

    async findAll(): Promise<Team[]> {
        return this.teamRepository.find();
    }

    async findOne({ id, where }: { id?: string, where?: object }): Promise<Team> {
        return this.teamRepository.findOne(id, { where, relations: ["players", "players.user", "coach"] });
    }

    async remove(id: string): Promise<object> {
        return await this.teamRepository.delete(id);
    }

    async edit(id: string, payload: any): Promise<object> {
        await this.savePlayers({ players: payload.players, teamId: parseInt(id) })
        payload.coachId = await this.saveCoach(payload.coach)
        delete payload.players
        delete payload.coach
        return await this.teamRepository.update(id, payload);
    }

    async saveCoach(user: User): Promise<number> {
        const userCreated = await this.userService.create(user)
        return userCreated.id
    }

    async savePlayers({ players, teamId }: { players: Player[], teamId: number }) {
        if (players && teamId) {
            players = await Promise.all(players.map(async (player) => {
                return {
                    ...player,
                    teamId
                }
            }))
            await this.playerService.createMany(players)
        }
    }

}