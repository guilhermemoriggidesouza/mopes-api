import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './User/User.entity';
import { UserModule } from './User/User.module';
import { config as configDotenv } from 'dotenv'
configDotenv()

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.HOST_DB_MOPE,
            port: parseInt(process.env.PORT_DB_MOPE),
            username: process.env.USER_DB_MOPE,
            password: process.env.PASSWORD_DB_MOPE,
            database: process.env.DATABASE_DB_MOPE,
            entities: [User],
            synchronize: true,
        }),
    ],
})
export class AppModule { }
