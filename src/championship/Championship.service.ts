import { Dependencies, Injectable } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Championship } from './Championship.entity';

@Injectable()
@Dependencies(getRepositoryToken(Championship))
export class ChampionshipService {
    championshipRepository: Repository<Championship>;

    constructor(championshipRepository: Repository<Championship>) {
        this.championshipRepository = championshipRepository;
    }

    async create(Championship: Championship, ownerId: number): Promise<Championship> {
        return this.championshipRepository.save({ ...Championship, ownerId })
    }

    async findAll(): Promise<Championship[]> {
        return this.championshipRepository.find();
    }

    async findOne({ id, where }: { id?: string, where?: object }): Promise<Championship> {
        return this.championshipRepository.findOne(id, { where, relations: ['users', "owner"] });
    }

    async remove(id: string): Promise<object> {
        return await this.championshipRepository.delete(id);
    }

    async edit(id: string, payload: object): Promise<object> {
        return await this.championshipRepository.update(id, payload);
    }

}
