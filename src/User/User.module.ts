import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserController } from './User.controller';
import { UserService } from './User.service';
import { User } from './User.entity';

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [TypeOrmModule.forFeature([User])],
})
export class UserModule { }