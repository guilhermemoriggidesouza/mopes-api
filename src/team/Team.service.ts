import { UserService } from 'src/user/User.service';
import { PlayerService } from './../player/Player.service';
import { Player } from 'src/player/Player.entity';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Team } from './Team.entity';
import { User } from 'src/user/User.entity';
import { Championship } from 'src/championship/entities/Championship.entity';

@Injectable()
export class TeamService {
  constructor(
    private playerService: PlayerService,
    private userService: UserService,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectConnection() private readonly connection: Connection,
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
      relations: ['players', 'players.user', 'coachs'],
    });
  }

  async remove(id: string): Promise<any> {
    await this.playerService.remove({ where: { teamId: id } });
    await this.userService.remove({ where: { teamId: id } });
    return await this.teamRepository.delete(id);
  }

  async edit(id: string, payload: any, orgId: number): Promise<any> {
    await this.savePlayers({
      players: payload.players,
      teamId: parseInt(id),
      orgId,
    });
    await this.saveCoachs({
      coachs: payload.coachs,
      teamId: parseInt(id),
      orgId,
    });
    delete payload.players;
    delete payload.coachs;
    return await this.teamRepository.update(id, payload);
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

  async saveCoachs({
    coachs,
    teamId,
    orgId,
  }: {
    coachs: User[];
    teamId: number;
    orgId: number;
  }) {
    if (coachs && teamId) {
      coachs = coachs
        .map((coach) => ({
          ...coach,
          teamId,
          orgId,
          role: 'coach',
        }))
        .filter((coach) => !coach.id);
      await this.userService.createMany(coachs, teamId);
    }
  }

  async findTableGame({
    championshipId,
  }: {
    championshipId: string;
  }): Promise<tableGame> {
    const tableGame = await this.connection.query(`
      SELECT 
        te.id,
        te."name" as "nameTeam",
        game.total as "game",
        COALESCE(sum(status_game."point"), 0) as "pointsDoIt",  
        pointsRestrict.total as "pointsDontDoIt",
        (sum(status_game."point") - pointsRestrict.total) as "balancePoints",
        sum(status_game."fault") as "faults",
        championship_keys.name as key
      FROM public.team te
      LEFT JOIN LATERAL (
        SELECT count(*) as total
        FROM sumula_teams_team stt
        INNER JOIN sumula ON sumula.id = stt."sumulaId"
        INNER JOIN championship ON championship.id = sumula."championshipId"
        INNER JOIN category_game ON category_game.id = championship."categoryId"
        WHERE  te.id = stt."teamId" AND category_game."maxPeriod" = sumula."actualPeriod"
      ) as game ON 1=1
      LEFT JOIN LATERAL (
        SELECT 
          SUM(sg2.point) as total
        FROM 
          sumula_teams_team stt
          INNER JOIN status_game sg2 ON sg2."teamId" <> stt."teamId" AND sg2."sumulaId" = stt."sumulaId"
        WHERE 
          stt."teamId" = te.id
      ) as pointsRestrict ON 1=1
      LEFT JOIN sumula_teams_team ON sumula_teams_team."teamId" = te.id
      LEFT JOIN sumula ON sumula_teams_team."sumulaId" = sumula.id
      LEFT JOIN status_game ON status_game."sumulaId" = sumula.id and status_game."teamId" = te.id
      LEFT JOIN championship ON championship.id = sumula."championshipId"
      LEFT JOIN championship_keys ON championship_keys.id = sumula."championshipKeysId"
      where championship.id = ${championshipId}
      GROUP by te.name, game.total, pointsRestrict.total, championship_keys.name, te.id
      ORDER BY "pointsDoIt" DESC, game.total DESC
    `);
    return tableGame;
  }
}
