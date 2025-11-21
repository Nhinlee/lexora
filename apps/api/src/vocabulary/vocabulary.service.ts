import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VocabularyService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllVocabulary() {
    return this.prisma.vocabulary.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
