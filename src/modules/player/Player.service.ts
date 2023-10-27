import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Player } from './Player.entity';
import { TeamService } from '../team/Team.service';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly teamsService: TeamService,
  ) { }

  async create(player: Player): Promise<Player> {
    return this.playerRepository.save(player);
  }

  async findAll(): Promise<Player[]> {
    return this.playerRepository.find();
  }

  async findOne({ id, where }: { id?: string; where?: any }): Promise<Player> {
    return this.playerRepository.findOne(id, {
      where,
      relations: ['user', 'teams'],
    });
  }

  async remove({ id, where }: { id?: string; where?: any }): Promise<any> {
    return await this.playerRepository.delete(id || where);
  }

  async edit(id: string, payload: any): Promise<any> {
    return await this.playerRepository.update(id, payload);
  }
  async addTeam({ teamId, id }: { id: string, teamId: string }): Promise<any> {
    const player = await this.playerRepository.findOne(id, { relations: ["teams"] })
    const team = await this.teamsService.findOne({ id: teamId, withoutRelations: true })
    player.teams.push(team)
    await this.playerRepository.save(player);
  }
}
