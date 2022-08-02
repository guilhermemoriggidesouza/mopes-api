import { PlayerInMatch } from 'src/sumula/entities/PlayerInMatch.entity';
import { SumulaGateway } from './Sumula.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SumulaController } from './Sumula.controller';
import { SumulaService } from './Sumula.service';
import { Sumula } from './entities/Sumula.entity';
import { PlayerModule } from 'src/player/Player.module';
import { StatusGamePeriod } from './entities/StatusGamePeriod.entity';
import { ChampionshipModule } from 'src/championship/Championship.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sumula, PlayerInMatch, StatusGamePeriod]),
    ChampionshipModule,
    PlayerModule,
  ],
  controllers: [SumulaController],
  providers: [SumulaService, SumulaGateway],
  exports: [SumulaService],
})
export class SumulaModule {}
