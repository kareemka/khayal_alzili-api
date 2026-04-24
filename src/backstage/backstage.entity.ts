import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Backstage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @CreateDateColumn()
  createdAt: Date;
}
