import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ChampionshipController } from './Championship.controller';
import { ChampionshipService } from './Championship.service';
import { Championship } from './entities/Championship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Championship])],
  controllers: [ChampionshipController],
  providers: [ChampionshipService],
  exports: [ChampionshipService],
})
export class ChampionshipModule {}
