import { Sumula } from 'src/sumula/entities/Sumula.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Championship } from './Championship.entity';

@Entity()
export class ChampionshipKeys {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Championship)
  championship: Championship;

  @Column()
  championshipId: number;

  @OneToMany(() => Sumula, (champKey) => champKey.championshipKeys)
  sumulas?: Sumula[];
}
