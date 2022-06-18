import { GameControl } from 'src/sumula/entities/GameControl.entity';
import { Dependencies, Injectable } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sumula } from './entities/Sumula.entity';

@Injectable()
@Dependencies(getRepositoryToken(Sumula))
export class SumulaService {

    constructor(
        private readonly sumulaRepository: Repository<Sumula>,
        private readonly gameControl: Repository<GameControl>,
    ) { }

    async create(Sumula: Sumula, ownerId: number): Promise<Sumula> {
        return this.sumulaRepository.save({ ...Sumula, ownerId })
    }

    async findAll(): Promise<Sumula[]> {
        return this.sumulaRepository.find();
    }

    async findOne({ id, where }: { id?: string, where?: object }): Promise<Sumula> {
        return this.sumulaRepository.findOne(id, { where, relations: ['teams', 'championship', 'championship.category', 'gameControls'] });
    }

    async remove(id: string): Promise<object> {
        return await this.sumulaRepository.delete(id);
    }

    async edit(id: string, payload: object): Promise<object> {
        return await this.sumulaRepository.update(id, payload);
    }

    async addingInteration(id: string, payload: pointingSumula | faultingSumula): Promise<object> {
        return await this.gameControl.save({
            sumulaId: parseInt(id),
            ...payload
        });
    }

    async removeInteration(gameControlId: string): Promise<object> {
        return await this.gameControl.delete({
            id: parseInt(gameControlId),
        });
    }

    async findAllInterations(id: string): Promise<GameControl[]> {
        return await this.gameControl.find({
            sumulaId: parseInt(id)
        })
    }

}
