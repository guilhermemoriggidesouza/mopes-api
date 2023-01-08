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

@Entity()
export class Org {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo: string;

  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @Column({ nullable: true })
  ownerId: number;

  @OneToMany(() => User, (user) => user.org)
  users: User[];

  @ManyToMany(() => Team)
  @JoinTable()
  teams: Team[];

  @Column({ default: false })
  payedIntegration: boolean;
}
