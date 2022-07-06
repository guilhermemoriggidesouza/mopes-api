import { Championship } from 'src/championship/Championship.entity';
import { Org } from 'src/org/Org.entity';
import { Player } from 'src/player/Player.entity';
import { User } from 'src/user/User.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => User)
  creator: User;

  @Column()
  creatorId: number;

  @ManyToOne(() => Org)
  org: Org;

  @Column()
  orgId: number;

  @ManyToOne(() => Championship)
  championship: Championship;

  @Column({ nullable: true })
  championshipId: number;

  @OneToOne(() => User)
  @JoinColumn()
  coach: User;

  @Column({ nullable: true })
  coachId: number;

  @Column()
  numberPlayers: number;

  @Column({ default: false })
  payedIntegration: boolean;

  @Column({ nullable: true })
  key: string;

  @OneToMany(() => Player, (player) => player.team)
  players: Player[];
}
