import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './User.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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
    return this.userRepository.save(User);
  }

  async createMany(Users: User[], teamId): Promise<User[]> {
    return Promise.all(Users.map(async (user) => this.create(user)));
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
