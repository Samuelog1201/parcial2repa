import { ConflictException } from '@nestjs/common';
import { BookRulesService } from './book-rules.service';
import { BookEntity } from './entities/book.entity';

describe('BookRulesService', () => {
  let service: BookRulesService;

  beforeEach(() => {
    service = new BookRulesService();
  });

  it('rejects a book without available copies', () => {
    const book = { id: 3, title: 'The Little Prince', availableCopies: 0 } as BookEntity;

    // Compruebo que la regla real rechaza el préstamo cuando no quedan copias.
    expect(() => service.ensureCanBorrow(book)).toThrow(ConflictException);
  });
});
