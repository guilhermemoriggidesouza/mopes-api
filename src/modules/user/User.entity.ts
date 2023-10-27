import { Player } from 'src/modules/player/Player.entity';
import { Team } from '../team/Team.entity';
import { Org } from '../org/Org.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Championship } from 'src/modules/championship/entities/Championship.entity';

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

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ default: '' })
  rg: string;

  @Column()
  password: string;

  @Column({ default: 'player', nullable: true })
  role?: string;

  @ManyToOne(() => Org, (user) => user.owners)
  org?: Org;
  @Column({ nullable: true })
  orgId?: number;

  @OneToMany(() => Team, (team) => team.creator)
  teamsCreated?: Team[];

  @OneToMany(() => Championship, (champ) => champ.owner)
  championshipsOwner?: Championship[];

  @OneToOne(() => Player, (player) => player.user)
  player?: Player;
  @Column({ nullable: true })
  playerId?: number;

  @Column({ nullable: true })
  profilePic?: string;

  @Column({ nullable: true })
  documentPic?: string;
}
