import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async getBook(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        pages: {
          include: {
            vocabulary: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }
}
