import { PrismaService } from '../prisma/prisma.service';
export declare class BooksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getBook(id: string): Promise<{
        pages: ({
            vocabulary: {
                id: string;
                createdAt: Date;
                imageUrl: string | null;
                word: string;
                definition: string;
                contextSentence: string;
                imageSearchQuery: string;
                masteryLevel: number;
                pageEntryId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            pageNumber: string;
            imageUrl: string;
            bookId: string;
        })[];
    } & {
        id: string;
        title: string;
        author: string;
        coverImage: string | null;
        createdAt: Date;
    }>;
}
