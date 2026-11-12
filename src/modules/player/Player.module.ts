import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PlayerController } from './Player.controller';
import { PlayerService } from './Player.service';
import { Player } from './Player.entity';
import { Team } from '../team/Team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player, Team])],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule { }
