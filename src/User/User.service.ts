import { Dependencies, Injectable } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
@Dependencies(getRepositoryToken(User))
export class UserService {
    userRepository: Repository<User>;

    constructor(userRepository: Repository<User>) {
        this.userRepository = userRepository;
    }

    async create(User: User): Promise<User> {
        return this.userRepository.save(User)
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne({ id, where }: { id?: string, where?: object }): Promise<User> {
        return this.userRepository.findOne(id, { where, relations: ["org", "teamsCreated"] });
    }

    async remove(id: string): Promise<object> {
        return await this.userRepository.delete(id);
    }

    async edit(id: string, payload: object): Promise<object> {
        return await this.userRepository.update(id, payload);
    }

}
