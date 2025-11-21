import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { AiModule } from '../ai/ai.module';
import { SearchModule } from '../search/search.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AiModule, SearchModule, PrismaModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
