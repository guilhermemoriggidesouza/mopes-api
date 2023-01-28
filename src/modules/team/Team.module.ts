import { UserModule } from '../user/User.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TeamController } from './Team.controller';
import { TeamService } from './Team.service';
import { Team } from './Team.entity';
import { PlayerModule } from '../player/Player.module';
import { OrgModule } from '../org/Org.module';

@Module({
  imports: [UserModule, PlayerModule, TypeOrmModule.forFeature([Team]), OrgModule],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
