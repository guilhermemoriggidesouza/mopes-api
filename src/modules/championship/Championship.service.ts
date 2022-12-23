import {
  Dependencies,
  Injectable,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm';
import { SumulaService } from 'src/modules/sumula/Sumula.service';
import { Team } from 'src/modules/team/Team.entity';
import { TeamService } from 'src/modules/team/Team.service';
import { In, Repository } from 'typeorm';
import { Championship } from './entities/Championship.entity';
import { ChampionshipKeys } from './entities/ChampionshipKeys.entity';
import { NAME_KEYS } from './_nameKeys';

@Injectable()
export class ChampionshipService {
  constructor(
    @InjectRepository(Championship)
    private readonly championshipRepository: Repository<Championship>,

    @InjectRepository(ChampionshipKeys)
    private readonly championshipKeyRepository: Repository<ChampionshipKeys>,

    @Inject(forwardRef(() => SumulaService))
    private readonly sumulasService: SumulaService,
    private readonly teamsService: TeamService,
  ) {}

  getNameKey(index): string {
    if (NAME_KEYS[index]) {
      return NAME_KEYS[index];
    }
    return NAME_KEYS[index] + index;
  }

  createArray(number) {
    return Array.from({ length: number }, (_, i) => i + 1);
  }

  async generateSumulas({
    championshipId,
    gamePerKeys,
    blankGames,
    championshipKeys,
  }: {
    championshipId: number;
    gamePerKeys: number;
    blankGames: number;
    championshipKeys: any[];
  }) {
    const sumulasToCreate: any = championshipKeys.map((championshipKey) =>
      this.createArray(gamePerKeys).map(() => ({
        championshipId,
        championshipKeysId: championshipKey.id,
      })),
    );
    sumulasToCreate.push(
      this.createArray(blankGames).map(() => ({
        championshipId,
      })),
    );
    return this.sumulasService.createMany(sumulasToCreate.flat());
  }

  async generateGames({
    keys,
    gamePerKeys,
    blankGames,
    championshipId,
  }: {
    keys: number;
    gamePerKeys: number;
    blankGames: number;
    championshipId: number;
  }) {
    if (keys > 0 && gamePerKeys > 0) {
      const createdKeys = await Promise.all(
        this.createArray(keys).map(async (key, index) => {
          return this.championshipKeyRepository.save({
            championshipId,
            name: this.getNameKey(index),
          });
        }),
      );
      await this.generateSumulas({
        championshipId,
        gamePerKeys,
        blankGames,
        championshipKeys: createdKeys,
      });
    }
  }

  async create(championship: any, ownerId: number): Promise<any> {
    const championshipGen = await this.championshipRepository.save({
      ...championship,
      ownerId,
    });
    await this.generateGames({
      keys: championship.keys,
      gamePerKeys: championship.gamePerKeys,
      blankGames: championship.blankGames,
      championshipId: championshipGen.id,
    });
  }

  async findAll(where?: any): Promise<Championship[]> {
    return this.championshipRepository.find(where && { where });
  }

  async findAllChampionshipKeys(where?: any): Promise<ChampionshipKeys[]> {
    return this.championshipKeyRepository.find(where && { where });
  }

  async findOne({
    id,
    where,
  }: {
    id?: string;
    where?: any;
  }): Promise<Championship> {
    const championship = await this.championshipRepository.findOne(id, {
      relations: [
        'category',
        'championshipKeys',
        'championshipKeys.sumulas',
        'championshipKeys.sumulas.teams',
      ],
    });
    championship.sumulas = await this.sumulasService.findAll(
      {
        championshipKeysId: null,
        championshipId: id,
      },
      ['teams'],
    );
    return championship;
  }

  async remove(id: string): Promise<any> {
    const sumulas = await this.sumulasService.findAll({
      championshipId: parseInt(id),
    });
    await Promise.all(
      sumulas.map((sumula) =>
        this.sumulasService.remove({ id: sumula.id.toString() }),
      ),
    );
    await this.championshipKeyRepository.delete({
      championshipId: parseInt(id),
    });
    return await this.championshipRepository.delete(id);
  }

  async edit(id: string, payload: any): Promise<any> {
    return await this.championshipRepository.update(id, payload);
  }

  async startChampionship({ id }: { id: string }) {
    const championship = await this.championshipRepository.findOne(id, {
      relations: ['teams'],
    });
    if (championship.teams.length == 0) {
      throw new BadRequestException(
        'Cannot start championship by #withoutTeams',
      );
    }
    championship.teams.forEach((team) => {
      if (!team.payedIntegration) {
        throw new BadRequestException(
          'Cannot start championship by #payedIntegration',
        );
      }
    });

    return this.championshipRepository.update(id, { started: true });
  }

  unifiqueArray(arrayToUnify: any[]) {
    return arrayToUnify.filter((value, index) => {
      const _value = JSON.stringify(value);
      return (
        index ===
        arrayToUnify.findIndex((obj) => {
          return JSON.stringify(obj) === _value;
        })
      );
    });
  }

  async syncTeamChampionship({ championshipId }: { championshipId: number }) {
    const championship = await this.championshipRepository.findOne(
      championshipId,
      {
        relations: [
          'championshipKeys',
          'championshipKeys.sumulas',
          'championshipKeys.sumulas.teams',
        ],
      },
    );
    championship.teams = this.unifiqueArray([
      ...championship.championshipKeys.flatMap((champKey) => {
        return champKey.sumulas.flatMap((sumula) => sumula.teams);
      }),
    ]);
    return this.championshipRepository.save({ ...championship });
  }
}
