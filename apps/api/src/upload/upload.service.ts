import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { SearchService } from '../search/search.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    private readonly aiService: AiService,
    private readonly searchService: SearchService,
    private readonly prisma: PrismaService,
  ) {}

  async processPage(file: Express.Multer.File) {
    this.logger.log(`Processing file: ${file.originalname}`);

    // 1. Create or get a default book (for MVP)
    // In a real app, bookId would be passed in
    let book = await this.prisma.book.findFirst({
      where: { title: 'Demo Book' },
    });

    if (!book) {
      book = await this.prisma.book.create({
        data: {
          title: 'Demo Book',
          author: 'Unknown Author',
        },
      });
    }

    // 3. AI Extraction
    const aiResult = await this.aiService.extractVocabulary(file.buffer);
    const pageIndex = aiResult.page_index || 'Unknown Location';
    const vocabularyData = aiResult.vocabulary || [];

    this.logger.log(`Extracted location: ${pageIndex}, words: ${vocabularyData.length}`);

    // 2. Save PageEntry
    const pageEntry = await this.prisma.pageEntry.create({
      data: {
        bookId: book.id,
        pageNumber: pageIndex,
        imageUrl: 'placeholder_url',
      },
    });

    // 4. Process each word
    const results: any[] = [];
    for (const item of vocabularyData) {
      // 5. Search Image
      let imageUrl: string | null = null;
      if (item.image_query) {
        imageUrl = await this.searchService.searchImage(item.image_query);
      }

      // 6. Save Vocabulary
      const vocab = await this.prisma.vocabulary.create({
        data: {
          pageEntryId: pageEntry.id,
          word: item.word,
          definition: item.definition,
          contextSentence: item.context,
          imageSearchQuery: item.image_query,
          imageUrl: imageUrl,
        },
      });
      results.push(vocab);
    }

    return {
      pageEntry,
      vocabulary: results,
    };
  }
}
