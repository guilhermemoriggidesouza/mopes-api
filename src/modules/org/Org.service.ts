import { Dependencies, Injectable } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Org } from './Org.entity';

@Injectable()
@Dependencies(getRepositoryToken(Org))
export class OrgService {
    orgRepository: Repository<Org>;

    constructor(orgRepository: Repository<Org>) {
        this.orgRepository = orgRepository;
    }

    async create(Org: Org, ownerId: number): Promise<Org> {
        return this.orgRepository.save({ ...Org, ownerId })
    }

    async findAll(): Promise<Org[]> {
        return this.orgRepository.find();
    }

    async findOne({ id, where }: { id?: string, where?: object }): Promise<Org> {
        return this.orgRepository.findOne(id, { where, relations: ["teams", "championships"] });
    }

    async remove(id: string): Promise<object> {
        return await this.orgRepository.delete(id);
    }

    async edit(id: string, payload: object): Promise<object> {
        return await this.orgRepository.update(id, payload);
    }

}
