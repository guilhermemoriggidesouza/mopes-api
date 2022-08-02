import { Team } from 'src/team/Team.entity';
import { CategoryGame } from '../../categoryGame/CategoryGame.entity';
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
import { Sumula } from 'src/sumula/entities/Sumula.entity';
import { ChampionshipKeys } from './ChampionshipKeys.entity';

@Entity()
export class Championship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo?: string;

  @ManyToOne(() => User)
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
  gamePerKeys: number;

  @Column({ default: false })
  started: boolean;

  @OneToMany(() => Sumula, (sumula) => sumula.championship)
  sumulas?: Sumula[];

  @OneToMany(() => ChampionshipKeys, (champKey) => champKey.championship)
  keys: ChampionshipKeys[];
}
