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

  async findAll(where?: object): Promise<Team[]> {
    return this.teamRepository.find({ where });
  }

  async findOne({ id, where }: { id?: string; where?: object }): Promise<Team> {
    return this.teamRepository.findOne(id, {
      where,
      relations: ['players', 'players.user', 'coach'],
    });
  }

  async remove(id: string): Promise<object> {
    return await this.teamRepository.delete(id);
  }

  async edit(id: string, payload: any, orgId: number): Promise<object> {
    await this.savePlayers({
      players: payload.players,
      teamId: parseInt(id),
      orgId,
    });
    console.log('saved players');
    payload.coachId = await this.saveCoach(payload.coach, parseInt(id));
    console.log('saved coach');
    delete payload.players;
    delete payload.coach;
    return await this.teamRepository.update(id, payload);
  }

  async saveCoach(user: User, id: number): Promise<number> {
    if (user.id) {
      await this.teamRepository.update(id, { coachId: null });
      await this.userService.remove(user.id.toString());
    }
    const userCreated = await this.userService.create(user);
    return userCreated.id;
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
      await this.playerService.createMany(players, orgId);
    }
  }
}
