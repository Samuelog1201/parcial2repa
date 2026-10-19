import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { requestValidationPipe } from '../common/request-validation.pipe';
import { CreateBookDto } from './dto/create-book.dto';
import { FilterBooksQueryDto } from './dto/filter-books-query.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Post()
  create(@Body(requestValidationPipe) dto: CreateBookDto) {
    // Recibo el body mediante el DTO y dejo que el pipe lo valide antes de llamar al servicio.
    return this.booksService.create(dto);
  }

  // Completed reference endpoint. Keep it BEFORE the dynamic GET ':id' route.
  @Get('search')
  findFiltered(@Query(requestValidationPipe) query: FilterBooksQueryDto) {
    return this.booksService.findFiltered(query);
  }

  @Patch(':id/borrow')
  borrow(@Param('id', ParseIntPipe) id: number) {
    // Uso ParseIntPipe para rechazar IDs que no sean enteros antes de ejecutar el préstamo.
    return this.booksService.borrow(id);
  }

  // The existing endpoints below are completed. Do not change them.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(requestValidationPipe) dto: UpdateBookDto,
  ) {
    return this.booksService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }
}
