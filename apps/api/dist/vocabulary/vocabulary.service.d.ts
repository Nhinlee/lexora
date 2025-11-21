import { PrismaService } from '../prisma/prisma.service';
export declare class VocabularyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllVocabulary(): Promise<{
        id: string;
        createdAt: Date;
        imageUrl: string | null;
        word: string;
        definition: string;
        contextSentence: string;
        imageSearchQuery: string;
        masteryLevel: number;
        pageEntryId: string;
    }[]>;
}
