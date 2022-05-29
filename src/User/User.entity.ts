import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'date' })
    birthday: string;

    @Column()
    login: string;

    @Column()
    password: string;

    @Column({ default: 'player', nullable: true })
    role: string;

}