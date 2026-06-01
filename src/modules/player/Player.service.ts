import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
import { Connection, In, Repository } from 'typeorm';
import { Player } from './Player.entity';
import { TeamService } from '../team/Team.service';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly teamsService: TeamService,
    @InjectConnection() private readonly connection: Connection,
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

  async getPlayedGamesAndGoals(playerId: string): Promise<{ games: any[]; gols: number }> {
    const games = await this.connection.query(
      `
      SELECT DISTINCT s.id, s."championshipId", s."actualPeriod"
      FROM sumula s
      INNER JOIN player_in_match pim ON pim."sumulaId" = s.id
      WHERE pim."playerId" = $1
      `,
      [playerId],
    );

    const golsResult = await this.connection.query(
      `
      SELECT COALESCE(SUM(sg.point), 0) as gols
      FROM status_game sg
      INNER JOIN player_in_match pim ON sg."playerInMatchId" = pim.id
      WHERE pim."playerId" = $1
      `,
      [playerId],
    );

    return {
      games: games || [],
      gols: golsResult?.[0]?.gols || 0,
    };
  }

  async addTeam({ teamId, id }: { id: string, teamId: string }): Promise<any> {
    const player = await this.playerRepository.findOne(id, { relations: ["teams"] })
    const team = await this.teamsService.findOne({ id: teamId, withoutRelations: true })
    player.teams.push(team)
    await this.playerRepository.save(player);
  }
}
