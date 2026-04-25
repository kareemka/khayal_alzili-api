import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Category } from '../categories/category.entity';



@Entity()
export class Show {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  coverImage: string; // Landscape for background

  @Column({ nullable: true })
  thumbnailImage: string; // Portrait for cards



  @ManyToOne(() => Category, category => category.shows, { eager: true, onDelete: 'CASCADE' })
  category: Category;

  @Column({ nullable: true })
  youtubeTrailerLink: string;


  @Column({ nullable: true })
  seoImage: string; // Optimized image for SEO/Social sharing

  @Column({ default: '2026' })
  releaseYear: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
