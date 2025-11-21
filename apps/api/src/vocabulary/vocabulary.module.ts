import { Module } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VocabularyController],
  providers: [VocabularyService],
})
export class VocabularyModule {}
