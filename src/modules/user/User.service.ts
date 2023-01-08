import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './User.entity';
import { PlayerService } from './../player/Player.service';

@Injectable()
export class UserService {
  constructor(
    private playerService: PlayerService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(User: User): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { login: User.login },
    });
    if (user) {
      throw new BadRequestException(
        `Login for player {${User.login}} already exists`,
      );
    }
    const userInserted = await this.userRepository.save(User);
    if (User.role == 'player') {
      this.playerService.create({ name: User.name, userId: userInserted.id });
    }
    return User;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne({ id, where }: { id?: string; where?: any }): Promise<User> {
    return this.userRepository.findOne(id, {
      where,
      relations: ['org', 'teamsCreated'],
    });
  }

  async remove({ id, where }: { id?: string; where?: any }): Promise<any> {
    return await this.userRepository.delete(id || where);
  }

  async edit(id: string, payload: any): Promise<any> {
    return await this.userRepository.update(id, payload);
  }

  async getLoginLink(id: string): Promise<any> {
    const user = await this.userRepository.findOne(id);
    const { password, teamsCreated, ...result } = user;
    return { access_token: this.jwtService.sign(result) };
  }
}
