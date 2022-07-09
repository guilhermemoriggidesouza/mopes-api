import { StatusGamePeriod } from './StatusGamePeriod.entity';
import { Sumula } from 'src/sumula/entities/Sumula.entity';
import { Player } from 'src/player/Player.entity';
import { Team } from 'src/team/Team.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';

@Entity()
export class PlayerInMatch {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sumula, { onDelete: 'CASCADE' })
  sumula: Sumula;
  @Column()
  sumulaId: number;

  @ManyToOne(() => Team, { onDelete: 'CASCADE' })
  team: Team;
  @Column()
  teamId: number;

  @ManyToOne(() => Player, { onDelete: 'CASCADE' })
  player: Player;
  @Column()
  playerId: number;

  @Column({ default: 0 })
  point: number;

  @Column({ default: 0 })
  fault: number;

  @OneToMany(() => StatusGamePeriod, (SGP) => SGP.playerInMatch, {
    onDelete: 'CASCADE',
  })
  statusGamePeriod: StatusGamePeriod[];
}
