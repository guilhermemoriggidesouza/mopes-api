import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './User.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(User: User): Promise<User> {
    return this.userRepository.save(User);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne({ id, where }: { id?: string; where?: object }): Promise<User> {
    return this.userRepository.findOne(id, {
      where,
      relations: ['org', 'teamsCreated'],
    });
  }

  async remove({
    id,
    where,
  }: {
    id?: string; 
    where?: any;
  }): Promise<object> {
    return await this.userRepository.delete(id || where);
  }

  async edit(id: string, payload: object): Promise<object> {
    return await this.userRepository.update(id, payload);
  }
}
