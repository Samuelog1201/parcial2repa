import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../categories/entities/category.entity';
import { BookEntity } from './entities/book.entity';

@Injectable()
export class LibrarySeedService implements OnModuleInit {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    // Seed ONLY a completely empty database. Never reset the student's changes.
    const categoryCount = await this.categoriesRepository.count();
    const bookCount = await this.booksRepository.count();
    if (categoryCount > 0 || bookCount > 0) return;

    const categories = await this.categoriesRepository.save(
      this.categoriesRepository.create([
        { name: 'Technology' },
        { name: 'Literature' },
      ]),
    );
    const books = this.booksRepository.create([
      { title: 'Clean Code', availableCopies: 3, category: categories[0] },
      { title: 'The Pragmatic Programmer', availableCopies: 1, category: categories[0] },
      { title: 'The Little Prince', availableCopies: 0, category: categories[1] },
    ]);
    await this.booksRepository.save(books);
  }
}
