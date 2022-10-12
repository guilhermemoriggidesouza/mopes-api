import { PlayerService } from '../player/Player.service';
import { PlayerInMatch } from 'src/sumula/entities/PlayerInMatch.entity';
import { StatusGame } from './entities/StatusGame.entity';
import { Team } from 'src/team/Team.entity';
import {
  Dependencies,
  Injectable,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import {
  getRepositoryToken,
  InjectConnection,
  InjectRepository,
} from '@nestjs/typeorm';
import { Connection, In, Repository } from 'typeorm';
import { Sumula } from './entities/Sumula.entity';
import { TeamService } from 'src/team/Team.service';
import { ChampionshipService } from 'src/championship/Championship.service';
import { Server } from 'socket.io';

@Injectable()
export class SumulaService {
  constructor(
    @InjectRepository(Sumula)
    private readonly sumulaRepository: Repository<Sumula>,
    @InjectRepository(PlayerInMatch)
    private readonly playerInMatchRepository: Repository<PlayerInMatch>,
    @InjectRepository(StatusGame)
    private readonly statusGameRepository: Repository<StatusGame>,

    private readonly playerService: PlayerService,
    private readonly teamsService: TeamService,
    private readonly championshipService: ChampionshipService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(sumula: Sumula): Promise<Sumula> {
    return this.sumulaRepository.save({ ...sumula });
  }
  async createMany(sumulas: Sumula[]): Promise<any> {
    return this.sumulaRepository
      .createQueryBuilder()
      .insert()
      .values(sumulas)
      .execute();
  }

  async findAll(): Promise<Sumula[]> {
    return this.sumulaRepository.find({
      relations: ['teams', 'championship', 'championship.category'],
      where: {
        championship: {
          started: true,
        },
      },
    });
  }

  async findOne({ id, where }: { id?: string; where?: any }): Promise<Sumula> {
    return this.sumulaRepository.findOne(id, {
      where,
      relations: [
        'teams',
        'championship',
        'championship.category',
        'playersInMatch',
      ],
    });
  }

  async buildStatusTeam(sumulaId, teamsParam): Promise<team[]> {
    const teams: team[] = await this.connection.query(`
      SELECT t.id, t.name, SUM(sg.point) AS points, SUM(sg.fault) AS faults 
      FROM team t 
      LEFT JOIN status_game sg ON t.id = sg."teamId" and sg."sumulaId" = ${sumulaId}
      WHERE t.id in (${teamsParam.map((team) => team.id)})
      GROUP BY t.id, t.name
    `);
    return teams || [];
  }
  async buildStatusPlayer(
    teams: number[],
    sumulaId: number,
  ): Promise<players[]> {
    const players = await this.connection.query(`
      SELECT pl.id, pl."userId", us.name as "userName", pl.infractions, pl."teamId", pl.name, pin.id as "playerInMatchId", pin."sumulaId", coalesce(SUM(sg.point),0) as points, coalesce(SUM(sg.fault), 0) as faults
      FROM player pl 
      LEFT JOIN player_in_match pin ON pl.id = pin."playerId" AND pin."sumulaId" = ${sumulaId} 
      LEFT JOIN status_game sg ON pin.id = sg."playerInMatchId"
      LEFT JOUN user us ON us.id = pl."userId"
      WHERE pl."teamId" in (${teams.join(',')})      
      group by pl.name, pin.id, pin."sumulaId", pl.id, pl."userId", pl.infractions, pl."teamId"
    `);
    return players;
  }

  async buildStatusPeriod(sumulaId: number): Promise<periods[]> {
    const periods: periods[] = await this.connection.query(
      `SELECT SUM(sg.point) AS points, SUM(sg.fault) AS faults, period FROM status_game sg where sg."sumulaId" = ${sumulaId} GROUP BY period`,
    );
    return periods || [];
  }

  async sendMessage(sender: Server, payload, sumulaId) {
    const messages = [];
    const sumula = await this.sumulaRepository.findOne(sumulaId, {
      relations: ['championship', 'championship.category'],
    });
    const [[statusPerTeam], [statusPerPlayer]] = await Promise.all([
      this.statusGameRepository.query(`
        SELECT coalesce(SUM(sg.fault), 0) as faults, t.name
        FROM status_game sg
        LEFT JOIN team t ON t.id = sg."teamId"
        WHERE sg."sumulaId" = ${sumulaId} AND sg.period = ${payload.period} and sg."teamId" = ${payload.teamId}
        GROUP BY t.name
      `),
      this.statusGameRepository.query(`
        SELECT coalesce(SUM(sg.fault), 0) as faults, p.name
        FROM status_game sg
        LEFT JOIN player_in_match pin ON pin.id = sg."playerInMatchId"
        LEFT JOIN player p ON p.id = pin."playerId"
        WHERE sg."sumulaId" = ${sumulaId} AND sg.period = ${payload.period} and sg."playerInMatchId" = ${payload.playerInMatchId}
        GROUP BY p.name
      `),
    ]);

    if (
      statusPerTeam.faults % sumula.championship.category.maxFaultsPerTeam ==
      0
    ) {
      messages.push({
        resp: statusPerTeam.name,
        type: 'maxFaultsPerTeam',
      });
    }

    if (
      statusPerPlayer.faults %
        sumula.championship.category.maxFaultsPerPlayer ==
      0
    ) {
      messages.push({
        resp: statusPerPlayer.name,
        type: 'maxFaultsPerPlayer',
      });
    }
    sender.emit(`alert:${sumulaId}`, messages);
  }

  createArray(number) {
    return Array.from({ length: number }, (_, i) => i + 1);
  }

  async getGameStatus({ id }: { id: string }): Promise<gameStatus> {
    const sumulaInfos = await this.sumulaRepository.findOne(id, {
      relations: [
        'teams',
        'championship',
        'championship.category',
        'statusGame',
        'statusGame.team',
        'statusGame.playerInMatch',
        'statusGame.playerInMatch.player',
      ],
    });
    const processedsBuilders: Promise<any>[] = [
      this.buildStatusTeam(parseInt(id), sumulaInfos.teams),
      this.buildStatusPeriod(parseInt(id)),
    ];
    const [teams, periods] = await Promise.all(processedsBuilders);
    const players = await this.buildStatusPlayer(
      teams.map((team) => team.id),
      parseInt(id),
    );
    return {
      ...sumulaInfos,
      teams,
      periods,
      players,
    } as gameStatus;
  }

  async remove({ id, where }: { id?: string; where?: any }): Promise<any> {
    await this.statusGameRepository.delete({ sumulaId: parseInt(id) });
    await this.playerInMatchRepository.delete({ sumulaId: parseInt(id) });
    return await this.sumulaRepository.delete(id || where);
  }

  async updateTeams(id: string, payload: any): Promise<any> {
    const sumula = await this.sumulaRepository.findOne(id);
    if (payload.teams) {
      const ids = payload.teams.map((id) => parseInt(id));
      sumula.teams = await this.teamsService.findAll({
        id: In(ids),
      });
    }
    await this.sumulaRepository.save(sumula);
    await this.championshipService.syncTeamChampionship({
      championshipId: sumula.championshipId,
    });
    return sumula;
  }

  async edit(id: string, payload: any): Promise<any> {
    return await this.sumulaRepository.update(id, payload);
  }

  async addInteraction(payload: any, id: string): Promise<any> {
    const sumulaInfos = await this.findOne({ id });
    return this.statusGameRepository.save({
      playerInMatchId: payload.playerInMatchId,
      sumulaId: parseInt(id),
      teamId: payload.teamId,
      point: payload.data.point,
      fault: payload.data.fault,
      period: sumulaInfos.actualPeriod,
    });
  }

  async createPlayerStatusInMatch(
    id: string,
    payload: pointingSumula | faultingSumula,
  ): Promise<any> {
    return await this.addInteraction(payload, id);
  }

  async removePlayerStatus(statusId: string): Promise<any> {
    return await this.statusGameRepository.delete(parseInt(statusId));
  }

  async findAllPlayerInMatch(id: string): Promise<PlayerInMatch[]> {
    return this.playerInMatchRepository.find({
      sumulaId: parseInt(id),
    });
  }

  async addingPlayerInMatch(id: string, payload: any): Promise<any> {
    const {
      championship: { category },
    } = await this.sumulaRepository.findOne(id, {
      relations: ['championship', 'championship.category'],
    });
    const playerInMatch = await this.playerInMatchRepository.findOne({
      where: { playerId: payload.playerId, sumulaId: id },
    });
    if (playerInMatch) {
      throw new BadRequestException('Error player cannot be insert game');
    }
    const player = await this.playerService.findOne({ id: payload.playerId });
    if (player.infractions >= category.maxInfractionPerPlayer) {
      throw new BadRequestException('Error player cannot be insert game');
    }
    await this.playerInMatchRepository.save({
      sumulaId: parseInt(id),
      teamId: player.teamId,
      playerId: player.id,
    });
  }
}
