import { Controller, Get, Param } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get(':id')
  getBook(@Param('id') id: string) {
    return this.booksService.getBook(id);
  }
}
