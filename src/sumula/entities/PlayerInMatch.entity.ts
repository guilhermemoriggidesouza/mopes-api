import { Sumula } from 'src/sumula/entities/Sumula.entity';
import { Player } from 'src/player/Player.entity';
import { Team } from 'src/team/Team.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity()
export class PlayerInMatch {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Sumula)
    sumula: Sumula;
    @Column()
    sumulaId: number;
    
    @ManyToOne(() => Team)
    team: Team;
    @Column()
    teamId: number;
    
    @ManyToOne(() => Player)
    player: Player;
    @Column()
    playerId: number;

    @Column({default: 0})
    point: number;

    @Column({default: 0})
    fault: number;
}