import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity()
export class Org {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @OneToOne(()=> User)
    @JoinColumn()
    owner: User;

    @Column()
    ownerId: number;

    @OneToMany(() => User, user => user.org)
    users: User[];

    @Column()
    payedIntegration: boolean;
}