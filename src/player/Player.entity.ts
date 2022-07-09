import { Team } from 'src/team/Team.entity';
import { User } from 'src/user/User.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ nullable: true, default: 0 })
  infractions?: number;

  @OneToOne(() => User)
  @JoinColumn()
  user?: User;

  @Column({ nullable: true })
  userId: number;

  @RelationId((player: Player) => player.team)
  @Column()
  teamId: number;

  @ManyToOne(() => Team, (team) => team.players, { onDelete: 'CASCADE' })
  team?: Team;
}
