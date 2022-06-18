import { GameControl } from './GameControl.entity';
import { Championship } from './../../championship/Championship.entity';
import { Team } from 'src/team/Team.entity';
import { Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany, ManyToOne, Column, OneToMany } from 'typeorm';

@Entity()
export class Sumula {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Team)
    @JoinTable()
    teams: Team[];

    @ManyToOne(() => Championship)
    championship: Championship;

    @Column({ nullable: true })
    championshipId: number;

    @OneToMany(() => GameControl, GC => GC.sumula)
    gameControls: GameControl[];

    @Column()
    actualPeriod: number;
}