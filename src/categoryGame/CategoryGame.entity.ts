import { Championship } from '../championship/entities/Championship.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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
  maxPlayersPerGame: number;

  @Column({ default: 5 })
  maxFaultsPerPlayer: number;

  @Column({ default: 5 })
  maxFaultsPerTeam: number;

  @Column({ default: 2 })
  maxInfractionPerPlayer: number;

  @OneToMany(() => Championship, (champ) => champ.category)
  championships: Championship[];
}
