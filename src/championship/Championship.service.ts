import { Dependencies, Injectable, BadRequestException } from '@nestjs/common';
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm';
import { Sumula } from 'src/sumula/entities/Sumula.entity';
import { SumulaService } from 'src/sumula/Sumula.service';
import { Repository } from 'typeorm';
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

    private readonly sumulasService: SumulaService,
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
    championshipKeys,
  }: {
    championshipId: number;
    gamePerKeys: number;
    championshipKeys: any[];
  }) {
    const sumulasToCreate = championshipKeys.map((championshipKey) =>
      this.createArray(gamePerKeys).map(() => ({
        championshipId,
        actualPeriod: 0,
        championshipKeysId: championshipKey.id,
      })),
    );
    return this.sumulasService.createMany(sumulasToCreate.flat());
  }

  async generateKeys({
    keys,
    gamePerKeys,
    championshipId,
  }: {
    keys: number;
    gamePerKeys: number;
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
        championshipKeys: createdKeys,
      });
    }
  }

  async create(championship: any, ownerId: number): Promise<any> {
    const championshipGen = await this.championshipRepository.save({
      ...championship,
      ownerId,
    });

    await this.generateKeys({
      keys: championship.keys,
      gamePerKeys: championship.gamePerKeys,
      championshipId: championshipGen.id,
    });
  }

  async findAll(where: any): Promise<Championship[]> {
    return this.championshipRepository.find({ where });
  }

  async findOne({
    id,
    where,
  }: {
    id?: string;
    where?: any;
  }): Promise<Championship> {
    return this.championshipRepository.findOne(id, {
      where,
      relations: [
        'teams',
        'category',
        'owner',
        'championshipKeys',
        'championshipKeys.sumulas',
        'championshipKeys.sumulas.teams',
      ],
    });
  }

  async remove(id: string): Promise<any> {
    await this.sumulasService.remove({
      where: { championshipId: parseInt(id) },
    });
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
    championship.teams.forEach((team) => {
      if (!team.payedIntegration) {
        throw new BadRequestException(
          'Cannot start championship by #payedIntegration',
        );
      }
    });

    return this.championshipRepository.update(id, { started: true });
  }
}
