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

  @Column()
  maxFaultsPerPlayer: number;

  @OneToMany(() => Championship, (champ) => champ.category)
  championships: Championship[];
}
