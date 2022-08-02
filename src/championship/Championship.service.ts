import { Dependencies, Injectable, BadRequestException } from '@nestjs/common';
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm';
import { SumulaService } from 'src/sumula/Sumula.service';
import { Repository } from 'typeorm';
import { Championship } from './entities/Championship.entity';
import { ChampionshipKeys } from './entities/ChampionshipKeys.entity';
import { NAME_KEYS } from './_nameKeys';

@Injectable()
@Dependencies(getRepositoryToken(Championship))
export class ChampionshipService {
  constructor(
    @InjectRepository(Championship)
    private readonly championshipRepository: Repository<Championship>,
    private readonly championshipKeyRepository: Repository<ChampionshipKeys>,
    private readonly sumulasService: SumulaService,
  ) {}

  async getNameKey(index) {
    if (NAME_KEYS[index]) {
      return NAME_KEYS[index];
    }
    return NAME_KEYS[index] + index;
  }

  async generateSumulas({
    championshipId,
    gamePerKeys,
    keyId,
  }: {
    championshipId: number;
    gamePerKeys: number;
    keyId: number;
  }) {
    const createdSumulas = Array.from(Array(gamePerKeys).keys()).map(
      async (gamePerKey) => {
        return this.sumulasService.create({
          championshipId,
          actualPeriod: 0,
          keyId,
        });
      },
    );
    return Promise.all(createdSumulas);
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
      const createdKeys = Array.from(Array(keys).keys()).map(
        async (key, index) => {
          const keyGenerated = await this.championshipKeyRepository.save({
            championshipId,
            name: this.getNameKey(index),
          });
          await this.generateSumulas({
            championshipId,
            gamePerKeys,
            keyId: keyGenerated.id,
          });
        },
      );
      return Promise.all(createdKeys);
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
      relations: ['teams', 'category', 'owner', 'sumulas', 'keys'],
    });
  }

  async remove(id: string): Promise<any> {
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
