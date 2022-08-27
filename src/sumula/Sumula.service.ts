import { PlayerService } from '../player/Player.service';
import { PlayerInMatch } from 'src/sumula/entities/PlayerInMatch.entity';
import { StatusGamePeriod } from './entities/StatusGamePeriod.entity';
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
    @InjectRepository(StatusGamePeriod)
    private readonly statusGamePeriodsRepository: Repository<StatusGamePeriod>,

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

  somePointsOrFaults(type: string, playersOfTeam: PlayerInMatch[]) {
    if (playersOfTeam.length == 0) return 0;
    return playersOfTeam
      .flatMap((player: PlayerInMatch) => player.statusGamePeriod)
      .map((status) => status[type])
      .reduce((currentValue, previousValue) => currentValue + previousValue);
  }

  async buildStatusTeam(
    teams: Team[],
    playersInMatch: PlayerInMatch[],
  ): Promise<team[]> {
    if (teams.length == 0) return [];
    return teams.map((teamItem) => {
      const playersOfTeam = playersInMatch.filter(
        (playerInMatch) => playerInMatch.teamId == teamItem.id,
      );
      return {
        name: teamItem.name,
        points: this.somePointsOrFaults('points', playersOfTeam),
        faults: this.somePointsOrFaults('faults', playersOfTeam),
      };
    });
  }

  getPointsByTeamInPeriod(
    statusGame: StatusGamePeriod[],
    teams: Team[],
  ): number {
    const eachTeamPoints = teams.map((team) => {
      const teamPoint = statusGame.find((stats) => stats.teamId == team.id);
      return teamPoint.point;
    });
    return eachTeamPoints.reduce((cv, pv) => cv + pv);
  }

  async buildStatusPeriod(
    periods: number,
    statusGame: StatusGamePeriod[],
  ): Promise<periodInfos[]> {
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

  async buildPlayersInMatch(
    playersInMatch: PlayerInMatch[],
  ): Promise<playersInMatch[]> {
    if (playersInMatch.length == 0) return [];
    return playersInMatch.map((players) => ({
      ...players,
      point: players.statusGamePeriod
        .map((status) => status.point)
        .reduce((currentValue, previousValue) => currentValue + previousValue),
      fault: players.statusGamePeriod
        .map((status) => status.fault)
        .reduce((currentValue, previousValue) => currentValue + previousValue),
    }));
  }

  async getGameStatus({ id }: { id: string }): Promise<gameStatus> {
    const sumulaInfos = await this.sumulaRepository.findOne(id, {
      relations: [
        'teams',
        'championship',
        'championship.category',
        'playersInMatch',
        'playersInMatch.statusGamePeriod',
        'statusGamePeriod',
      ],
    });
    const processedsBuilders: Promise<any>[] = [
      this.buildPlayersInMatch(sumulaInfos.playersInMatch),
      this.buildStatusTeam(sumulaInfos.teams, sumulaInfos.playersInMatch),
      this.buildStatusPeriod(
        sumulaInfos.actualPeriod,
        sumulaInfos.statusGamePeriod,
      ),
    ];
    const [playersInMatch, teams, periods] = await Promise.all(
      processedsBuilders,
    );

    return {
      ...sumulaInfos,
      playersInMatch,
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
    this.championshipService.syncTeamChampionship({
      championshipId: sumula.championshipId,
    });
    await this.sumulaRepository.save(sumula);
    return sumula;
  }

  async edit(id: string, payload: any): Promise<any> {
    return await this.sumulaRepository.update(id, payload);
  }

  async addInteraction(payload: any, id: string): Promise<any> {
    const sumulaInfos = await this.findOne({ id });
    return this.statusGamePeriodsRepository.save({
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

  async removePlayerStatus(statusIds: string[]): Promise<any> {
    const status = await this.statusGamePeriodsRepository.findByIds(statusIds);
    return status.map(async (status) => {
      return this.statusGamePeriodsRepository.delete({
        id: status.id,
      });
    });
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
    const player = await this.playerService.findOne({ id: payload.playerId });
    if (player.infractions == category.maxFaultsPerPlayer) {
      throw new BadRequestException('Error player cannot be insert game');
    }
    return this.playerInMatchRepository.save({
      sumulaId: parseInt(id),
      ...payload,
    });
  }
}
