"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
let SearchService = SearchService_1 = class SearchService {
    logger = new common_1.Logger(SearchService_1.name);
    apiKey = process.env.SERPER_API_KEY;
    async searchImage(query) {
        if (!this.apiKey) {
            this.logger.warn('SERPER_API_KEY is not set');
            return null;
        }
        try {
            const response = await fetch('https://google.serper.dev/images', {
                method: 'POST',
                headers: {
                    'X-API-KEY': this.apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ q: query }),
            });
            if (!response.ok) {
                throw new Error(`Serper API error: ${response.statusText}`);
            }
            const data = await response.json();
            return data.images?.[0]?.imageUrl || null;
        }
        catch (error) {
            this.logger.error(`Error searching image for query "${query}"`, error);
            return null;
        }
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = SearchService_1 = __decorate([
    (0, common_1.Injectable)()
], SearchService);
//# sourceMappingURL=search.service.js.map