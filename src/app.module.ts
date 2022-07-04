import { CategoryGameModule } from './categoryGame/CategoryGame.module';
import { Championship } from './championship/Championship.entity';
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

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: config.db_host,
            port: parseInt(config.db_port),
            username: config.db_username,
            password: config.db_password,
            database: config.db_database,
            entities: [User, Org, Team, Player, Championship, CategoryGame],
            synchronize: true,
            logging: true,
            ssl: true,
            extra: {
                ssl: {
                    rejectUnauthorized: false
                }
            }
        }),
        UserModule,
        PlayerModule,
        AuthModule,
        TeamModule,
        OrgModule,
        ChampionshipModule,
        CategoryGameModule
    ]
})
export class AppModule { }
