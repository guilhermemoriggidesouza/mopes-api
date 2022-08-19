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
    private teamRepository: Repository<Team>,
  ) {}

  async create(Team: Team, creatorId: number, orgId: number): Promise<Team> {
    return this.teamRepository.save({ ...Team, creatorId, orgId });
  }

  async findAll(where?: any): Promise<Team[]> {
    return this.teamRepository.find({ where, relations: ['championships'] });
  }

  async findOne({ id, where }: { id?: string; where?: any }): Promise<Team> {
    return this.teamRepository.findOne(id, {
      where,
      relations: ['players', 'players.user', 'coach'],
    });
  }

  async remove(id: string): Promise<any> {
    await this.playerService.remove({ where: { teamId: id } });
    await this.teamRepository.delete(id);
    return await this.userService.remove({ where: { teamId: id } });
  }

  async edit(id: string, payload: any, orgId: number): Promise<any> {
    await this.savePlayers({
      players: payload.players,
      teamId: parseInt(id),
      orgId,
    });
    payload.coachId = await this.updateOrCreate(payload.coach, parseInt(id));
    delete payload.players;
    delete payload.coach;
    return await this.teamRepository.update(id, payload);
  }

  async updateOrCreate(user: User, id: number): Promise<number> {
    if (!user.id) {
      user.teamId = id;
      user.role = 'coach';
      const createdUser = await this.userService.create(user);
      user.id = createdUser.id;
    } else {
      await this.userService.edit(user.id.toString(), user);
    }
    return user.id;
  }

  async savePlayers({
    players,
    teamId,
    orgId,
  }: {
    players: Player[];
    teamId: number;
    orgId: number;
  }) {
    if (players && teamId) {
      players = players.map((player) => ({
        ...player,
        teamId,
      }));
      await this.playerService.createMany(players, orgId, teamId);
    }
  }
}
