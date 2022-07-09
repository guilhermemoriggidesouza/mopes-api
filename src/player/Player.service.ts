import {
  BadRequestException,
  Dependencies,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/User.service';
import { In, Repository } from 'typeorm';
import { Player } from './Player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly userService: UserService,
  ) {}

  async create(player: Player): Promise<Player> {
    return this.playerRepository.save(player);
  }

  async createMany(players: Player[]) {
    await this.playerRepository.delete({
      id: In(players.map((player) => player.id).map((e) => e)),
    });
    console.log('deleted player', players);
    const playersInsert = players.map(async (player) => {
      const user = await this.userService.create(player.user);
      if (!user) {
        throw new BadRequestException('Error user by player cannot be created');
      }
      player.userId = user.id;
      delete player.user;
      console.log(player);
      return this.create(player);
    });
    console.log('player saved');
    return await Promise.all(playersInsert);
  }

  async findAll(): Promise<Player[]> {
    return this.playerRepository.find();
  }

  async findOne({
    id,
    where,
  }: {
    id?: string;
    where?: object;
  }): Promise<Player> {
    return this.playerRepository.findOne(id, {
      where,
      relations: ['user', 'team'],
    });
  }

  async remove(id: string): Promise<object> {
    return await this.playerRepository.delete(id);
  }

  async edit(id: string, payload: object): Promise<object> {
    return await this.playerRepository.update(id, payload);
  }

  async addingFault(id: number, fault: number): Promise<object> {
    return await this.playerRepository.increment({ id }, 'infractions', fault);
  }
}
