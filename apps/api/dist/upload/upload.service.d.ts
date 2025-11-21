import { AiService } from '../ai/ai.service';
import { SearchService } from '../search/search.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class UploadService {
    private readonly aiService;
    private readonly searchService;
    private readonly prisma;
    private readonly logger;
    constructor(aiService: AiService, searchService: SearchService, prisma: PrismaService);
    processPage(file: Express.Multer.File): Promise<{
        pageEntry: {
            id: string;
            createdAt: Date;
            pageNumber: string;
            imageUrl: string;
            bookId: string;
        };
        vocabulary: any[];
    }>;
}
