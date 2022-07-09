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

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ type: 'date', nullable: true })
  birthday?: string;

  @Column()
  login: string;

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

  @OneToOne(() => Team, (team) => team.coach, { onDelete: 'CASCADE' })
  team?: Team;
  @Column({ nullable: true })
  teamId?: number;

  @OneToOne(() => Player, (player) => player.user, { onDelete: 'CASCADE' })
  player?: Player;
  @Column({ nullable: true })
  playerId?: number;
}
