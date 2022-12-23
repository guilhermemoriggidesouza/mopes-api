import { SumulaModule } from './modules/sumula/Sumula.module';
import { PlayerInMatch } from 'src/modules/sumula/entities/PlayerInMatch.entity';
import { StatusGame } from './modules/sumula/entities/StatusGame.entity';
import { Sumula } from 'src/modules/sumula/entities/Sumula.entity';
import { CategoryGameModule } from './modules/categoryGame/CategoryGame.module';
import { Championship } from './modules/championship/entities/Championship.entity';
import { Player } from './modules/player/Player.entity';
import { AuthModule } from './modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/User.entity';
import { UserModule } from './modules/user/User.module';
import config from './config';
import { Org } from './modules/org/Org.entity';
import { OrgModule } from './modules/org/Org.module';
import { TeamModule } from './modules/team/Team.module';
import { Team } from './modules/team/Team.entity';
import { PlayerModule } from './modules/player/Player.module';
import { CategoryGame } from './modules/categoryGame/CategoryGame.entity';
import { ChampionshipModule } from './modules/championship/Championship.module';
import { ChampionshipKeys } from './modules/championship/entities/ChampionshipKeys.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      url: config.db_url,
      type: 'postgres',
      entities: [
        User,
        Org,
        Team,
        Player,
        Sumula,
        Championship,
        ChampionshipKeys,
        CategoryGame,
        StatusGame,
        PlayerInMatch,
      ],
      synchronize: true,
    }),
    UserModule,
    PlayerModule,
    AuthModule,
    TeamModule,
    OrgModule,
    SumulaModule,
    ChampionshipModule,
    CategoryGameModule,
  ],
})
export class AppModule {}
