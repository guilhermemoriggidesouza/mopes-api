import { Championship } from './../championship/Championship.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity()
export class CategoryGame {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column()
    maxPoints: number;
    
    @Column()
    maxPeriod: number;
    
    @Column()
    maxFaultsPerPlayer: number;

    @Column({default: false})
    pointsPerTeam: boolean;

    @OneToMany(() => Championship, champ => champ.category)
    championships: Championship[];
}