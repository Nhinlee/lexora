import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async getBook(id: string, query?: string) {
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

    if (query) {
      const lowerQuery = query.toLowerCase();
      const queryDigits = lowerQuery.replace(/\D/g, '');

      book.pages = book.pages.filter((page) => {
        const pageNum = page.pageNumber.toLowerCase();
        const pageDigits = pageNum.replace(/\D/g, '');

        return (
          pageNum.includes(lowerQuery) ||
          (queryDigits.length > 0 && pageDigits.includes(queryDigits))
        );
      });
    }

    return book;
  }
}
