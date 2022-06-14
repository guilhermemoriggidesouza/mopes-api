import { Player } from 'src/player/Player.entity';
import { User } from 'src/user/User.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => User)
    creator: User;

    @Column()
    creatorId: number;

    @OneToOne(() => User)
    @JoinColumn()
    coach: User;

    @Column({ nullable: true })
    coachId: number;

    @Column()
    numberPlayers: number;

    @Column({ default: false })
    payedIntegration: boolean;

    @Column({ nullable: true })
    key: string;

    @OneToMany(() => Player, player => player.team)
    players: Player[];
}