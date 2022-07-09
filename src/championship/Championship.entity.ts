import { Team } from 'src/team/Team.entity';
import { CategoryGame } from './../categoryGame/CategoryGame.entity';
import { User } from 'src/user/User.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Championship {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column({nullable: true})
    logo: string;
    
    @OneToOne(()=> User, { onDelete: 'CASCADE'})
    @JoinColumn()
    owner: User;

    @Column({nullable: true})
    ownerId: number;

    @OneToMany(() => Team, team => team.championship, { onDelete: 'CASCADE'})
    teams: Team[];

    @Column({default: false})
    payedIntegration: boolean;

    @ManyToOne(() => CategoryGame, { onDelete: 'CASCADE'})
    category: CategoryGame;

    @Column({nullable: true})
    categoryId: number;
}