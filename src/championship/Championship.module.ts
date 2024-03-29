import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { ChampionshipController } from './Championship.controller';
import { ChampionshipService } from './Championship.service';
import { Championship } from './entities/Championship.entity';
import { ChampionshipKeys } from './entities/ChampionshipKeys.entity';
import { SumulaModule } from 'src/sumula/Sumula.module';
import { TeamModule } from 'src/team/Team.module';

@Module({
  imports: [
    TeamModule,
    TypeOrmModule.forFeature([Championship, ChampionshipKeys]),
    forwardRef(() => SumulaModule),
  ],
  controllers: [ChampionshipController],
  providers: [ChampionshipService],
  exports: [ChampionshipService],
})
export class ChampionshipModule {}
