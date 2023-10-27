import { PlayerInMatch } from 'src/modules/sumula/entities/PlayerInMatch.entity';
import { Sumula } from 'src/modules/sumula/entities/Sumula.entity';
import { Team } from 'src/modules/team/Team.entity';
import { User } from 'src/modules/user/User.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  RelationId,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @OneToOne(() => User, (user) => user.player)
  @JoinColumn()
  user?: User;

  @Column({ nullable: true })
  userId?: number;

  @ManyToMany(() => Team)
  @JoinTable()
  teams?: Team[];

  @OneToMany(() => PlayerInMatch, (PIM) => PIM.player)
  playerInMatch?: PlayerInMatch[];
}
