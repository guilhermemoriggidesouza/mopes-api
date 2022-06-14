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

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: config.db_host,
            port: parseInt(config.db_port),
            username: config.db_username,
            password: config.db_password,
            database: config.db_database,
            entities: [User, Org, Team, Player],
            synchronize: true,
        }),
        UserModule,
        PlayerModule,
        AuthModule,
        TeamModule,
        OrgModule,
    ]
})
export class AppModule { }
