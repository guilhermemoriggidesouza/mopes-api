import {
  Dependencies,
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Championship } from './Championship.entity';

@Injectable()
@Dependencies(getRepositoryToken(Championship))
export class ChampionshipService {
  championshipRepository: Repository<Championship>;

  constructor(championshipRepository: Repository<Championship>) {
    this.championshipRepository = championshipRepository;
  }

  async create(
    championship: Championship,
    ownerId: number,
  ): Promise<Championship> {
    return this.championshipRepository.save({ ...championship, ownerId });
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
      relations: ['teams', 'category', 'owner'],
    });
  }

  async remove(id: string): Promise<any> {
    return await this.championshipRepository.delete(id);
  }

  async edit(id: string, payload: any, ownerId: number): Promise<any> {
    if (!ownerId) {
      throw new ForbiddenException(
        'Cannot edit this championship with this user',
      );
    }
    const user = await this.championshipRepository.findOne(id);
    if (user.ownerId != ownerId) {
      throw new ForbiddenException(
        'Cannot edit this championship with this user',
      );
    }
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
