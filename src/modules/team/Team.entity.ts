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

  @ManyToMany(() => Org)
  @JoinTable()
  orgs: Org[];

  @ManyToOne(() => CategoryGame)
  category: CategoryGame;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToMany(() => Championship)
  @JoinTable()
  championships: Championship[];

  @OneToMany(() => User, (user) => user.team)
  coachs: User[];

  @Column({ default: false })
  payedIntegration: boolean;

  @Column({ nullable: true })
  key: string;

  @OneToMany(() => Player, (player) => player.team)
  players: Player[];

  @OneToMany(() => StatusGame, (SGP) => SGP.team)
  statusGame?: StatusGame[];
}
