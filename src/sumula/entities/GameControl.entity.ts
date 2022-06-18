import { Sumula } from 'src/sumula/entities/Sumula.entity';
import { Player } from 'src/player/Player.entity';
import { Team } from 'src/team/Team.entity';
import { Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn, JoinTable, ManyToMany, ManyToOne, Column } from 'typeorm';

@Entity()
export class GameControl {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Sumula)
    sumula: Sumula;
    @Column({nullable: true})
    sumulaId: number;
    
    @ManyToOne(() => Team)
    team: Team;
    @Column()
    teamId: number;
    
    @ManyToOne(() => Player)
    player: Player;
    @Column({nullable: true})
    playerId: number;

    @Column({default: 0})
    point: number;

    @Column({default: 0})
    fault: number;

    @Column({default: 1})
    period: number
}