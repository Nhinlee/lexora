import { BooksService } from './books.service';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
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
