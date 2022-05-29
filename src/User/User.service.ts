import { Dependencies, Injectable } from '@nestjs/common';
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './User.entity';

@Injectable()
@Dependencies(getRepositoryToken(User))
export class UserService {
    usersRepository: Repository<User>;

    constructor(usersRepository: Repository<User>) {
        this.usersRepository = usersRepository;
    }

    async create(User: User): Promise<User> {
        return this.usersRepository.save(User)
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(id: string): Promise<User> {
        return this.usersRepository.findOne(id);
    }

    async remove(id: string): Promise<object> {
        return await this.usersRepository.delete(id);
    }

    async edit(id: string, payload: object): Promise<object> {
        return await this.usersRepository.update(id, payload);
    }
}
