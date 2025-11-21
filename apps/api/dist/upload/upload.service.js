"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../ai/ai.service");
const search_service_1 = require("../search/search.service");
const prisma_service_1 = require("../prisma/prisma.service");
let UploadService = UploadService_1 = class UploadService {
    aiService;
    searchService;
    prisma;
    logger = new common_1.Logger(UploadService_1.name);
    constructor(aiService, searchService, prisma) {
        this.aiService = aiService;
        this.searchService = searchService;
        this.prisma = prisma;
    }
    async processPage(file) {
        this.logger.log(`Processing file: ${file.originalname}`);
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
        const pageEntry = await this.prisma.pageEntry.create({
            data: {
                bookId: book.id,
                pageNumber: 'Page ' + Date.now(),
                imageUrl: 'placeholder_url',
            },
        });
        const vocabularyData = await this.aiService.extractVocabulary(file.buffer);
        this.logger.log(`Extracted ${vocabularyData.length} words`);
        const results = [];
        for (const item of vocabularyData) {
            let imageUrl = null;
            if (item.image_query) {
                imageUrl = await this.searchService.searchImage(item.image_query);
            }
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
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        search_service_1.SearchService,
        prisma_service_1.PrismaService])
], UploadService);
//# sourceMappingURL=upload.service.js.map