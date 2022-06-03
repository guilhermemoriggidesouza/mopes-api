import { Dependencies, Injectable } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './Team.entity';

@Injectable()
@Dependencies(getRepositoryToken(Team))
export class TeamService {
    teamRepository: Repository<Team>;

    constructor(teamRepository: Repository<Team>) {
        this.teamRepository = teamRepository;
    }

    async create(Team: Team, creatorId: number): Promise<Team> {
        return this.teamRepository.save({ ...Team, creatorId })
    }

    async findAll(): Promise<Team[]> {
        return this.teamRepository.find();
    }

    async findOne({ id, where }: { id?: string, where?: object }): Promise<Team> {
        return this.teamRepository.findOne(id, { where, relations: ["creator", "coach"] });
    }

    async remove(id: string): Promise<object> {
        return await this.teamRepository.delete(id);
    }

    async edit(id: string, payload: object): Promise<object> {
        return await this.teamRepository.update(id, payload);
    }

}
