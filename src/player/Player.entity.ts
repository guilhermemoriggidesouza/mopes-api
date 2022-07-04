import { Team } from 'src/team/Team.entity';
import { User } from 'src/user/User.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, RelationId } from 'typeorm';

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fantasyName: string;

    @Column({nullable: true})
    infractions: number;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
    @Column({ nullable: true })
    userId: number;

    @ManyToOne(() => Team)
    team: Team
    @RelationId((player: Player) => player.team)
    @Column()
    teamId: number;
}

