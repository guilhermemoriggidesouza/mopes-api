import { Dependencies, Injectable } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryGame } from './CategoryGame.entity';

@Injectable()
@Dependencies(getRepositoryToken(CategoryGame))
export class CategoryGameService {
    CategoryGameRepository: Repository<CategoryGame>;

    constructor(CategoryGameRepository: Repository<CategoryGame>) {
        this.CategoryGameRepository = CategoryGameRepository;
    }

    async create(CategoryGame: CategoryGame, ownerId: number): Promise<CategoryGame> {
        return this.CategoryGameRepository.save({ ...CategoryGame, ownerId })
    }

    async findAll(): Promise<CategoryGame[]> {
        return this.CategoryGameRepository.find();
    }

    async findOne({ id, where }: { id?: string, where?: object }): Promise<CategoryGame> {
        return this.CategoryGameRepository.findOne(id, { where, relations: ['championships'] });
    }

    async remove(id: string): Promise<object> {
        return await this.CategoryGameRepository.delete(id);
    }

    async edit(id: string, payload: object): Promise<object> {
        return await this.CategoryGameRepository.update(id, payload);
    }

}
