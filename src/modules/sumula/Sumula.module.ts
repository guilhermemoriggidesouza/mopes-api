import { PlayerInMatch } from 'src/modules/sumula/entities/PlayerInMatch.entity';
import { SumulaGateway } from './Sumula.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SumulaController } from './Sumula.controller';
import { SumulaService } from './Sumula.service';
import { Sumula } from './entities/Sumula.entity';
import { Player } from '../player/Player.entity';
import { StatusGame } from './entities/StatusGame.entity';
import { Team } from 'src/modules/team/Team.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sumula, PlayerInMatch, StatusGame, Player, Team]),
  ],
  controllers: [SumulaController],
  providers: [SumulaService, SumulaGateway],
  exports: [SumulaService],
})
export class SumulaModule {}
