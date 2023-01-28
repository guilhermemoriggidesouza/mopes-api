import { Team } from 'src/modules/team/Team.entity';
import { User } from 'src/modules/user/User.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Championship } from '../championship/entities/Championship.entity';

@Entity()
export class Org {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo: string;

  @OneToMany(() => User, (user) => user.org)
  owners: User[];

  @OneToMany(() => Championship, (champ) => champ.org)
  championships: Championship;

  @ManyToMany(() => Team, (team) => team.orgs)
  teams: Team[];

  @Column({ nullable: true, default: 0.0 })
  valuePayed?: number;

  @Column({ default: false })
  matriz: boolean;

}
