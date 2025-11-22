import { Controller, Get, Param, Query } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get(':id')
  getBook(@Param('id') id: string, @Query('q') query?: string) {
    return this.booksService.getBook(id, query);
  }
}
