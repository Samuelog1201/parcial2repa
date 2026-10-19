import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryEntity } from '../../categories/entities/category.entity';

@Entity('books')
export class BookEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 80 })
  title!: string;

  @Column({ type: 'int', name: 'available_copies', default: 0 })
  availableCopies!: number;

  @ManyToOne(() => CategoryEntity, (category) => category.books, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category!: CategoryEntity;
}
