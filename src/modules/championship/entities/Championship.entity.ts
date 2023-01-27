import { Team } from 'src/modules/team/Team.entity';
import { CategoryGame } from '../../categoryGame/CategoryGame.entity';
import { User } from 'src/modules/user/User.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Sumula } from 'src/modules/sumula/entities/Sumula.entity';
import { ChampionshipKeys } from './ChampionshipKeys.entity';
import { Org } from 'src/modules/org/Org.entity';

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

  @ManyToOne(() => Org)
  org?: Org;

  @Column({ nullable: true })
  orgId?: number;

  @ManyToMany(() => Team)
  @JoinTable()
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
  championshipKeys?: ChampionshipKeys[];
}
