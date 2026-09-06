import {
  Injectable,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { SumulaService } from 'src/modules/sumula/Sumula.service';
import { Team } from 'src/modules/team/Team.entity';
import { Connection, Repository } from 'typeorm';
import { Sumula } from 'src/modules/sumula/entities/Sumula.entity';
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

    @InjectConnection()
    private readonly connection: Connection,
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
    if (keys > 0) {
      const createdKeys = await Promise.all(
        this.createArray(keys).map(async (key, index) => {
          return this.championshipKeyRepository.save({
            championshipId,
            name: this.getNameKey(index),
          });
        }),
      );
      if (gamePerKeys > 0) {
        await this.generateSumulas({
          championshipId,
          gamePerKeys,
          blankGames,
          championshipKeys: createdKeys,
        });
      }
    }
  }

  async create(championship: any, ownerId: number): Promise<any> {
    const { keys, blankGames, gamePerKeys, keyNumber, ...rest } = championship;
    // as chaves e jogos so sao gerados no startChampionship, quando ja
    // sabemos quais times estao inscritos.
    return this.championshipRepository.save({
      ...rest,
      gamePerKeys: parseInt(gamePerKeys) || 0,
      keyNumber: parseInt(keyNumber) || 0,
      ownerId,
    });
  }

  async findAll(where?: any): Promise<Championship[]> {
    return this.championshipRepository.find({
      ...(where && { where }),
      relations: ['category'],
    });
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
    const { keys, blankGames, gamePerKeys, keyNumber, ...rest } = payload;

    const toUpdate: any = { ...rest };
    if (gamePerKeys !== undefined) {
      toUpdate.gamePerKeys = parseInt(gamePerKeys) || 0;
    }
    if (keyNumber !== undefined) {
      toUpdate.keyNumber = parseInt(keyNumber) || 0;
    }

    return this.championshipRepository.update(id, toUpdate);
  }

  buildRoundRobin(teams: Team[]): [Team, Team][] {
    const games: [Team, Team][] = [];
    for (let a = 0; a < teams.length; a++) {
      for (let b = a + 1; b < teams.length; b++) {
        games.push([teams[a], teams[b]]);
      }
    }
    return games;
  }

  async startChampionship({ id }: { id: string }) {
    const championshipId = parseInt(id);

    const championship = await this.championshipRepository.findOne(id, {
      relations: ['championshipKeys'],
    });

    if (!championship) {
      throw new BadRequestException('Cannot start championship by #notFound');
    }
    if (championship.started) {
      throw new BadRequestException(
        'Cannot start championship by #alreadyStarted',
      );
    }

    const teams = await this.connection
      .getRepository(Team)
      .createQueryBuilder('team')
      .leftJoin('team.championships', 'championship')
      .where('championship.id = :championshipId', { championshipId })
      .getMany();

    if (teams.length < 2) {
      throw new BadRequestException(
        'Cannot start championship by #withoutTeams',
      );
    }

    // limpa qualquer chave/jogo gerado antes (re-start apos reset, dados antigos)
    const existingSumulas = await this.sumulasService.findAll({ championshipId });
    await Promise.all(
      existingSumulas.map((sumula) =>
        this.sumulasService.remove({ id: sumula.id.toString() }),
      ),
    );
    await this.championshipKeyRepository.delete({ championshipId });

    // nº de chaves vem da config do campeonato; no minimo 1 e no maximo
    // floor(times / 2) pra cada chave ter pelo menos 2 times.
    const wantedKeys = championship.keyNumber > 0 ? championship.keyNumber : 1;
    const keyCount = Math.max(1, Math.min(wantedKeys, Math.floor(teams.length / 2)));

    const keys = await Promise.all(
      Array.from({ length: keyCount }, (_, index) =>
        this.championshipKeyRepository.save({
          championshipId,
          name: this.getNameKey(index),
        }),
      ),
    );

    const buckets: Team[][] = keys.map(() => []);
    teams.forEach((team, index) => {
      buckets[index % keyCount].push(team);
    });

    // fase de grupos: round-robin dentro de cada chave
    const groupSumulas: Partial<Sumula>[] = keys.flatMap((key, keyIndex) =>
      this.buildRoundRobin(buckets[keyIndex]).map(([teamA, teamB]) => ({
        championshipId,
        championshipKeysId: key.id,
        teams: [teamA, teamB],
      })),
    );
    await this.sumulasService.createManyWithTeams(groupSumulas);

    // fase de enfrentamento (mata-mata): gera as sumulas em branco.
    // classificados por chave = gamePerKeys, limitado ao tamanho da menor chave.
    const smallestBucket = Math.min(...buckets.map((bucket) => bucket.length));
    const classifiedPerKey = Math.min(
      championship.gamePerKeys > 0 ? championship.gamePerKeys : 1,
      smallestBucket,
    );
    const classified = keyCount * classifiedPerKey;
    const knockoutGames = classified >= 2 ? classified - 1 : 0;

    const knockoutSumulas: Partial<Sumula>[] = Array.from(
      { length: knockoutGames },
      () => ({ championshipId, championshipKeysId: null }),
    );
    if (knockoutSumulas.length) {
      await this.sumulasService.createManyWithTeams(knockoutSumulas);
    }

    await this.championshipRepository.update(id, { started: true });

    return {
      started: true,
      keys: keyCount,
      groupGames: groupSumulas.length,
      knockoutGames,
    };
  }

  /**
   * Zera o campeonato: remove todos os jogos (sumulas), seus lançamentos
   * (status_game / player_in_match) e as chaves geradas, e marca started = false.
   * Os times inscritos continuam vinculados, então o campeonato pode ser
   * reiniciado por startChampionship.
   */
  async resetChampionship({ id }: { id: string }) {
    const championshipId = parseInt(id);

    const championship = await this.championshipRepository.findOne(id);
    if (!championship) {
      throw new BadRequestException('Cannot reset championship by #notFound');
    }

    const sumulas = await this.sumulasService.findAll({ championshipId });
    await Promise.all(
      sumulas.map((sumula) =>
        this.sumulasService.remove({ id: String(sumula.id) }),
      ),
    );

    await this.championshipKeyRepository.delete({ championshipId });
    await this.championshipRepository.update(id, { started: false });

    return {
      started: false,
      removedGames: sumulas.length,
    };
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
