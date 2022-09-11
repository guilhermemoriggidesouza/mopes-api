import { SumulaModule } from './sumula/Sumula.module';
import { PlayerInMatch } from 'src/sumula/entities/PlayerInMatch.entity';
import { StatusGame } from './sumula/entities/StatusGame.entity';
import { Sumula } from 'src/sumula/entities/Sumula.entity';
import { CategoryGameModule } from './categoryGame/CategoryGame.module';
import { Championship } from './championship/entities/Championship.entity';
import { Player } from './player/Player.entity';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/User.entity';
import { UserModule } from './user/User.module';
import config from './config';
import { Org } from './org/Org.entity';
import { OrgModule } from './org/Org.module';
import { TeamModule } from './team/Team.module';
import { Team } from './team/Team.entity';
import { PlayerModule } from './player/Player.module';
import { CategoryGame } from './categoryGame/CategoryGame.entity';
import { ChampionshipModule } from './championship/Championship.module';
import { ChampionshipKeys } from './championship/entities/ChampionshipKeys.entity';

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
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
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
