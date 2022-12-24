import { StatusGame } from './StatusGame.entity';
import { PlayerInMatch } from './PlayerInMatch.entity';
import { Championship } from '../../championship/entities/Championship.entity';
import { Team } from 'src/modules/team/Team.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';
import { ChampionshipKeys } from 'src/modules/championship/entities/ChampionshipKeys.entity';

@Entity()
export class Sumula {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToMany(() => Team)
  @JoinTable()
  teams?: Team[];

  @ManyToOne(() => ChampionshipKeys)
  championshipKeys?: ChampionshipKeys;

  @Column({ nullable: true })
  championshipKeysId?: number;

  @ManyToOne(() => Championship)
  championship?: Championship;

  @Column()
  championshipId?: number;

  @OneToMany(() => PlayerInMatch, (GC) => GC.sumula)
  playersInMatch?: PlayerInMatch[];

  @OneToMany(() => StatusGame, (GC) => GC.sumula)
  statusGame?: StatusGame[];

  @Column({ default: 1 })
  actualPeriod?: number;
}
