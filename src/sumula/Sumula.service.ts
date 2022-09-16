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
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Sumula } from './entities/Sumula.entity';
import { TeamService } from 'src/team/Team.service';
import { ChampionshipService } from 'src/championship/Championship.service';

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

  somePointsOrFaults(type: string, statusGame: StatusGame[]) {
    if (statusGame.length == 0) return 0;
    return statusGame
      .map((status) => status[type])
      .reduce((currentValue, previousValue) => currentValue + previousValue);
  }

  getPlayersTeams(players): players[] {
    return players.map((player) => {
      return {
        ...player,
        faults: this.somePointsOrFaults(
          'fault',
          player.playerInMatch?.statusGame
            ? player.playerInMatch.statusGame
            : [],
        ),
        points: this.somePointsOrFaults(
          'point',
          player.playerInMatch?.statusGame
            ? player.playerInMatch.statusGame
            : [],
        ),
      };
    });
  }
  async buildStatusTeam(teams: Team[]): Promise<team[]> {
    if (teams.length == 0) return [];
    return Promise.all(
      teams.map(async (teamItem) => {
        return {
          ...teamItem,
          points: this.somePointsOrFaults('point', teamItem.statusGame || []),
          faults: this.somePointsOrFaults('fault', teamItem.statusGame || []),
          players: this.getPlayersTeams(teamItem.players),
        };
      }),
    );
  }

  getPointsByTeamInPeriod(statusGame: StatusGame[], teams: Team[]): number {
    const eachTeamPoints = teams.map((team) => {
      const teamPoint = statusGame.find((stats) => stats.teamId == team.id);
      return teamPoint.point;
    });
    return eachTeamPoints.reduce((cv, pv) => cv + pv);
  }

  async buildStatusPeriod(
    periods: number,
    statusGame: StatusGame[],
  ): Promise<periods[]> {
    if (statusGame.length == 0) return [];
    return Array(periods).map((periodNumber) => {
      const period = statusGame.filter((stats) => stats.period == periodNumber);
      return {
        points:
          period.length == 0
            ? 0
            : period.map((stats) => stats.point).reduce((cv, pv) => cv + pv),
        faults:
          period.length == 0
            ? 0
            : period.map((stats) => stats.fault).reduce((cv, pv) => cv + pv),
      };
    });
  }

  async getGameStatus({ id }: { id: string }): Promise<gameStatus> {
    const sumulaInfos = await this.sumulaRepository.findOne(id, {
      relations: [
        'teams',
        'teams.players',
        'teams.players.playerInMatch',
        'teams.players.playerInMatch.statusGame',
        'teams.statusGame',
        'championship',
        'playersInMatch',
        'championship.category',
        'statusGame',
        'statusGame.team',
        'statusGame.playerInMatch',
        'statusGame.playerInMatch.player',
      ],
    });
    const processedsBuilders: Promise<any>[] = [
      this.buildStatusTeam(sumulaInfos.teams),
      this.buildStatusPeriod(sumulaInfos.actualPeriod, sumulaInfos.statusGame),
    ];
    const [teams, periods] = await Promise.all(processedsBuilders);

    return {
      ...sumulaInfos,
      teams,
      periods,
    } as gameStatus;
  }

  async remove({ id, where }: { id?: string; where?: any }): Promise<any> {
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
      where: { playerId: payload.playerId },
    });
    console.log(playerInMatch, category.maxInfractionPerPlayer);
    if (playerInMatch) {
      throw new BadRequestException('Error player cannot be insert game');
    }

    const player = await this.playerService.findOne({ id: payload.playerId });
    if (player.infractions >= category.maxInfractionPerPlayer) {
      throw new BadRequestException('Error player cannot be insert game');
    }

    return this.playerInMatchRepository.save({
      sumulaId: parseInt(id),
      teamId: player.teamId,
      playerId: player.id,
    });
  }
}
