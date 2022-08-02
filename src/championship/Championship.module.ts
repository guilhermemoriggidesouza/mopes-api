import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ChampionshipController } from './Championship.controller';
import { ChampionshipService } from './Championship.service';
import { Championship } from './entities/Championship.entity';
import { ChampionshipKeys } from './entities/ChampionshipKeys.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Championship, ChampionshipKeys])],
  controllers: [ChampionshipController],
  providers: [ChampionshipService],
  exports: [ChampionshipService],
})
export class ChampionshipModule {}
