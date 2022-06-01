import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import config from './config';

@Module({
    imports: [
        AuthModule,
        UserModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: config.db_host,
            port: parseInt(config.db_port),
            username: config.db_username,
            password: config.db_password,
            database: config.db_database,
            entities: [User],
            synchronize: true,
        }),
    ],
})
export class AppModule { }
