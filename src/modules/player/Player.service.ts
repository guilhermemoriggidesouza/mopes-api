import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './Player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async create(player: Player): Promise<Player> {
    return this.playerRepository.save(player);
  }

  async findAll(): Promise<Player[]> {
    return this.playerRepository.find();
  }

  async findOne({ id, where }: { id?: string; where?: any }): Promise<Player> {
    return this.playerRepository.findOne(id, {
      where,
      relations: ['user', 'team'],
    });
  }

  async remove({ id, where }: { id?: string; where?: any }): Promise<any> {
    return await this.playerRepository.delete(id || where);
  }

  async edit(id: string, payload: any): Promise<any> {
    return await this.playerRepository.update(id, payload);
  }

  async addingFault(id: number, fault: number): Promise<any> {
    return await this.playerRepository.increment({ id }, 'infractions', fault);
  }
}
