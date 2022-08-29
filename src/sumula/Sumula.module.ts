import { PlayerInMatch } from 'src/sumula/entities/PlayerInMatch.entity';
import { SumulaGateway } from './Sumula.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SumulaController } from './Sumula.controller';
import { SumulaService } from './Sumula.service';
import { Sumula } from './entities/Sumula.entity';
import { PlayerModule } from 'src/player/Player.module';
import { StatusGame } from './entities/StatusGame.entity';
import { TeamModule } from 'src/team/Team.module';
import { ChampionshipModule } from 'src/championship/Championship.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sumula, PlayerInMatch, StatusGame]),
    PlayerModule,
    TeamModule,
    ChampionshipModule,
  ],
  controllers: [SumulaController],
  providers: [SumulaService, SumulaGateway],
  exports: [SumulaService],
})
export class SumulaModule {}
