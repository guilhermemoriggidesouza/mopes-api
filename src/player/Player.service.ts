import {
  BadRequestException,
  Dependencies,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/User.service';
import { In, IsNull, Not, Repository } from 'typeorm';
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

  async createMany(players: any[], orgId: number, teamId: number) {
    await this.playerRepository.delete({
      teamId,
    });
    await this.userService.remove({
      where: { teamId, playerId: Not(IsNull()) },
    });
    const playersInsert = players.map(async (player) => {
      const playerInserted = await this.create({
        name: player.name,
        teamId: player.teamId,
      });
      const user = await this.userService.create({
        name: player.name,
        login: player.login,
        password: player.password,
        orgId,
        playerId: playerInserted.id,
        teamId: player.teamId,
      });
      return this.playerRepository.update(playerInserted.id.toString(), {
        userId: user.id,
      });
    });
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

  async remove({ id, where }: { id?: string; where?: any }): Promise<object> {
    return await this.playerRepository.delete(id || where);
  }

  async edit(id: string, payload: object): Promise<object> {
    return await this.playerRepository.update(id, payload);
  }

  async addingFault(id: number, fault: number): Promise<object> {
    return await this.playerRepository.increment({ id }, 'infractions', fault);
  }
}
