import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PlayerController } from './Player.controller';
import { PlayerService } from './Player.service';
import { Player } from './Player.entity';
import { UserModule } from 'src/user/User.module';

@Module({
    imports: [UserModule, TypeOrmModule.forFeature([Player])],
    controllers: [PlayerController],
    providers: [PlayerService],
    exports: [PlayerService],
})
export class PlayerModule { }