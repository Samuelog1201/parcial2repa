import { ConflictException, Injectable } from '@nestjs/common';
import { BookEntity } from './entities/book.entity';

@Injectable()
export class BookRulesService {
  ensureCanBorrow(book: BookEntity): void {
    // Antes de descontar una copia, impido el préstamo cuando no hay disponibilidad.
    if (book.availableCopies === 0) {
      throw new ConflictException('Book has no available copies');
    }
  }
}
