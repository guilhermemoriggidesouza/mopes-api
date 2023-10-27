import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { PlayerController } from './Player.controller';
import { PlayerService } from './Player.service';
import { Player } from './Player.entity';
import { TeamModule } from '../team/Team.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player]),
    TeamModule
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule { }
