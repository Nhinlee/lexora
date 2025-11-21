import { VocabularyService } from './vocabulary.service';
export declare class VocabularyController {
    private readonly vocabularyService;
    constructor(vocabularyService: VocabularyService);
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
