import { Team } from 'src/team/Team.entity';
import { Sumula } from 'src/sumula/entities/Sumula.entity';
import { PlayerInMatch } from 'src/sumula/entities/PlayerInMatch.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity()
export class StatusGamePeriod {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PlayerInMatch, { onDelete: 'CASCADE' })
    playerInMatch: PlayerInMatch;
    @Column()
    playerInMatchId: number;

    @ManyToOne(() => Sumula, { onDelete: 'CASCADE' })
    sumula: Sumula;
    @Column()
    sumulaId: number;

    @ManyToOne(() => Team, { onDelete: 'CASCADE' })
    team: Team;
    @Column()
    teamId: number;

    @Column({ default: 0 })
    point: number;

    @Column({ default: 0 })
    fault: number;

    @Column({ default: 1 })
    period: number;
}