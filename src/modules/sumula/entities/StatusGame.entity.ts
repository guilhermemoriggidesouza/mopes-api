import { Team } from 'src/modules/team/Team.entity';
import { Sumula } from 'src/modules/sumula/entities/Sumula.entity';
import { PlayerInMatch } from 'src/modules/sumula/entities/PlayerInMatch.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity()
export class StatusGame {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => PlayerInMatch)
  playerInMatch?: PlayerInMatch;
  @Column({ nullable: true })
  playerInMatchId?: number;

  @ManyToOne(() => Sumula)
  sumula: Sumula;
  @Column()
  sumulaId: number;

  @ManyToOne(() => Team)
  team: Team;
  @Column()
  teamId: number;

  @Column({ default: 0 })
  point?: number;

  @Column({ default: 0 })
  fault?: number;

  @Column({ default: 1 })
  period: number;
}
