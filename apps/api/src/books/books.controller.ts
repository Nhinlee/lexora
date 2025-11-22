import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getBooks() {
    return this.booksService.getBooks();
  }

  @Post()
  createBook(@Body() body: { title: string; author: string }) {
    return this.booksService.createBook(body.title, body.author);
  }

  @Get(':id')
  getBook(@Param('id') id: string, @Query('q') query?: string) {
    return this.booksService.getBook(id, query);
  }
}
