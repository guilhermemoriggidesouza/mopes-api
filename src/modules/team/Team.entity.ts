import { Championship } from 'src/modules/championship/entities/Championship.entity';
import { Org } from 'src/modules/org/Org.entity';
import { Player } from '../player/Player.entity';
import { StatusGame } from 'src/modules/sumula/entities/StatusGame.entity';
import { User } from 'src/modules/user/User.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { CategoryGame } from '../categoryGame/CategoryGame.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  sex: string;

  @Column({ default: '' })
  city: string;

  @ManyToOne(() => User)
  creator: User;

  @Column()
  creatorId: number;

  @Column({ default: false })
  payedIntegration: boolean;

  @Column({ nullable: true })
  key: string;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => CategoryGame)
  category: CategoryGame;

  @OneToMany(() => StatusGame, (SGP) => SGP.team)
  statusGame?: StatusGame[];

  @ManyToMany(() => Org, (org) => org.teams)
  @JoinTable()
  orgs: Org[];

  @ManyToMany(() => Championship)
  @JoinTable()
  championships: Championship[];

  @ManyToMany(() => Player)
  @JoinTable()
  players: Player[];

  @ManyToMany(() => Player)
  @JoinTable({ name: "coachs" })
  coachs?: Player[];

}
