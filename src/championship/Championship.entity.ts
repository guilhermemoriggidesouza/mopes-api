import { Team } from 'src/team/Team.entity';
import { CategoryGame } from './../categoryGame/CategoryGame.entity';
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
export class Championship {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo?: string;

  @OneToOne(() => User)
  @JoinColumn()
  owner?: User;

  @Column({ nullable: true })
  ownerId?: number;

  @OneToMany(() => Team, (team) => team.championship)
  teams: Team[];

  @Column({ default: false })
  payedIntegration: boolean;

  @ManyToOne(() => CategoryGame)
  category: CategoryGame;

  @Column({ nullable: true })
  categoryId: number;

  @Column({ default: 0 })
  keys: number;

  @Column({ default: 0 })
  gamePerKeys: number;
}
