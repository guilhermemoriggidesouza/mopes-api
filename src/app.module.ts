import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import config from './config';
import { Org } from './org/Org.entity';
import { OrgModule } from './org/Org.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        OrgModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: config.db_host,
            port: parseInt(config.db_port),
            username: config.db_username,
            password: config.db_password,
            database: config.db_database,
            entities: [User, Org],
            synchronize: true,
        }),
    ]
})
export class AppModule { }
