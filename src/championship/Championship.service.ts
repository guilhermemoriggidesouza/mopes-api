import {
  Dependencies,
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm';
import { SumulaService } from 'src/sumula/Sumula.service';
import { Repository } from 'typeorm';
import { Championship } from './Championship.entity';

@Injectable()
@Dependencies(getRepositoryToken(Championship))
export class ChampionshipService {
  constructor(
    @InjectRepository(Championship)
    private readonly championshipRepository: Repository<Championship>,
    private readonly sumulasService: SumulaService,
  ) {}

  async create(
    championship: Championship,
    ownerId: number,
  ): Promise<Championship> {
    if (championship.keys > 0 && championship.gamePerKeys > 0) {
      const sumulasToGen = championship.keys * championship.gamePerKeys;
      Array.from(Array(sumulasToGen).keys()).forEach((key) => {
        this.sumulasService.create({
          championshipId: championship.id,
          actualPeriod: 0,
        });
      });
    }
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
      relations: ['teams', 'category', 'owner', 'sumulas'],
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
