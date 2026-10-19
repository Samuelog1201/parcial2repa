import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BookEntity } from '../../books/entities/book.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 80, unique: true })
  name!: string;

  @OneToMany(() => BookEntity, (book) => book.category)
  books!: BookEntity[];
}
