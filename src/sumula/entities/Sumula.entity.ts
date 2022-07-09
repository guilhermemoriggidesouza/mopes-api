import { StatusGamePeriod } from './StatusGamePeriod.entity';
import { PlayerInMatch } from './PlayerInMatch.entity';
import { Championship } from '../../championship/Championship.entity';
import { Team } from 'src/team/Team.entity';
import { Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany, ManyToOne, Column, OneToMany } from 'typeorm';

@Entity()
export class Sumula {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Team, { onDelete: 'CASCADE' })
    @JoinTable()
    teams: Team[];

    @ManyToOne(() => Championship, { onDelete: 'CASCADE' })
    championship: Championship;

    @Column({ nullable: true })
    championshipId: number;

    @OneToMany(() => PlayerInMatch, GC => GC.sumula, { onDelete: 'CASCADE' })
    playerInMatchs: PlayerInMatch[];

    @OneToMany(() => StatusGamePeriod, GC => GC.sumula, { onDelete: 'CASCADE' })
    statusGamePeriod: StatusGamePeriod[];

    @Column()
    actualPeriod: number;

}