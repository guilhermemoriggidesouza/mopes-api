import { Sumula } from 'src/sumula/entities/Sumula.entity';
import { Player } from 'src/player/Player.entity';
import { Team } from 'src/team/Team.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity()
export class Period {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Sumula)
    sumula: Sumula;
    @Column()
    sumulaId: number;

    @Column({ default: 0 })
    points: number;

    @Column({ default: 0 })
    faults: number;
}