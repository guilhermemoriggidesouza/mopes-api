import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SumulaController } from './Sumula.controller';
import { SumulaService } from './Sumula.service';
import { Sumula } from './entities/Sumula.entity';
import { PlayerModule } from 'src/player/Player.module';

@Module({
    imports: [TypeOrmModule.forFeature([Sumula]), PlayerModule],
    controllers: [SumulaController],
    providers: [SumulaService],
    exports: [SumulaService],
})
export class SumulaModule { }