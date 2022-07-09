import { Team } from './../team/Team.entity';
import { Org } from './../org/Org.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date', nullable: true })
  birthday: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column({ default: 'player', nullable: true })
  role: string;

  @ManyToOne(() => Org, (user) => user.users, { onDelete: 'CASCADE' })
  org: Org;
  @Column({ nullable: true })
  orgId: number;

  @OneToMany(() => Team, (team) => team.creator, { onDelete: 'CASCADE' })
  teamsCreated: Team[];
}
