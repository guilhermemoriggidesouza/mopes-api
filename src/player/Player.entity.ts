import { PlayerInMatch } from 'src/sumula/entities/PlayerInMatch.entity';
import { Sumula } from 'src/sumula/entities/Sumula.entity';
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
  OneToMany,
} from 'typeorm';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ nullable: true, default: 0 })
  infractions?: number;

  @OneToOne(() => User, (user) => user.player)
  @JoinColumn()
  user?: User;

  @Column({ nullable: true })
  userId?: number;

  @RelationId((player: Player) => player.team)
  @Column()
  teamId?: number;

  @ManyToOne(() => Team, (team) => team.players)
  team?: Team;

  @ManyToOne(() => Sumula)
  lastSumulaInfraction?: Sumula;
  @Column({ nullable: true })
  lastSumulaInfractionId?: number;

  @OneToMany(() => PlayerInMatch, (PIM) => PIM.player)
  playerInMatch?: PlayerInMatch[];
}
