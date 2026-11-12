import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TeamController } from './Team.controller';
import { TeamService } from './Team.service';
import { Team } from './Team.entity';
import { Org } from '../org/Org.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Org])],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule { }
