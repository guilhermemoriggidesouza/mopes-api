import { StatusGame } from './StatusGame.entity';
import { Sumula } from 'src/modules/sumula/entities/Sumula.entity';
import { Player } from '../../player/Player.entity';
import { Team } from 'src/modules/team/Team.entity';
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

  @ManyToOne(() => Sumula)
  sumula: Sumula;
  @Column()
  sumulaId: number;

  @ManyToOne(() => Team)
  team: Team;
  @Column()
  teamId: number;

  @ManyToOne(() => Player)
  player: Player;
  @Column()
  playerId: number;

  @Column()
  infractions: number;

  @OneToMany(() => StatusGame, (SGP) => SGP.playerInMatch)
  statusGame: StatusGame[];
}
