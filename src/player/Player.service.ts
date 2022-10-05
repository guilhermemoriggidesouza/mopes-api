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
    const playersInsert = players.map(async (player) => {
      const userInDB = await this.userService.findOne({
        where: { playerId: player.id },
      });
      if (userInDB) {
        return null;
      }
      const user = await this.userService.create({
        name: player.name,
        login: player.login,
        ra: player.ra,
        rg: player.rg,
        birthday: player.birthday,
        class: player.class,
        password: player.password,
        orgId,
        teamId: player.teamId,
      });
      const playerInserted = await this.create({
        name: player.name,
        teamId: player.teamId,
        userId: user.id,
      });
      return this.userService.edit(user.id.toString(), {
        playerId: playerInserted.id,
      });
    });
    return await Promise.all(playersInsert);
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

  async addingFault(
    id: number,
    fault: number,
    lastSumulaInfractionId: number,
  ): Promise<any> {
    await this.playerRepository.update({ id }, { lastSumulaInfractionId });
    return await this.playerRepository.increment({ id }, 'infractions', fault);
  }
}
