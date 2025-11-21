import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { SearchModule } from './search/search.module';
import { UploadModule } from './upload/upload.module';
import { PrismaModule } from './prisma/prisma.module';
import { BooksModule } from './books/books.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';

@Module({
  imports: [AiModule, SearchModule, UploadModule, PrismaModule, BooksModule, VocabularyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
