import { Player } from 'src/player/Player.entity';
import { Team } from './../team/Team.entity';
import { Org } from './../org/Org.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Championship } from 'src/championship/entities/Championship.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ type: 'date', nullable: true })
  birthday?: string;

  @Column({ unique: true })
  login: string;

  @Column({ default: '' })
  rg: string;

  @Column({ nullable: true })
  ra?: string;

  @Column({ default: '' })
  class: string;

  @Column()
  password: string;

  @Column({ default: 'player', nullable: true })
  role?: string;

  @ManyToOne(() => Org, (user) => user.users)
  org?: Org;
  @Column({ nullable: true })
  orgId?: number;

  @OneToMany(() => Team, (team) => team.creator)
  teamsCreated?: Team[];

  @OneToMany(() => Championship, (champ) => champ.owner)
  championshipsOwner?: Championship[];

  @ManyToOne(() => Team, (team) => team.coachs)
  team?: Team;
  @Column({ nullable: true })
  teamId?: number;

  @OneToOne(() => Player, (player) => player.user)
  player?: Player;
  @Column({ nullable: true })
  playerId?: number;
}
