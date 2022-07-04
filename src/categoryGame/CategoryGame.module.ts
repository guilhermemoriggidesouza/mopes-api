import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CategoryGameController } from './CategoryGame.controller';
import { CategoryGameService } from './CategoryGame.service';
import { CategoryGame } from './CategoryGame.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryGame])],
    controllers: [CategoryGameController],
    providers: [CategoryGameService],
    exports: [CategoryGameService],
})
export class CategoryGameModule { }