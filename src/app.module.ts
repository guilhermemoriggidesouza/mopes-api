import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './User/User.entity';
import { UserModule } from './User/User.module';

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'root',
            password: 'root',
            database: 'mope',
            entities: [User],
            synchronize: true,
        }),
    ],
})
export class AppModule { }
