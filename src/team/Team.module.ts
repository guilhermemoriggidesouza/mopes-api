import { UserModule } from './../user/User.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TeamController } from './Team.controller';
import { TeamService } from './Team.service';
import { Team } from './Team.entity';
import { PlayerModule } from 'src/player/Player.module';

@Module({
    imports: [
        UserModule,
        PlayerModule,
        TypeOrmModule.forFeature([Team]),
    ],
    controllers: [TeamController],
    providers: [TeamService],
    exports: [TeamService],
})
export class TeamModule { }