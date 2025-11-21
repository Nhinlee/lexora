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
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const client_bedrock_runtime_1 = require("@aws-sdk/client-bedrock-runtime");
let AiService = AiService_1 = class AiService {
    logger = new common_1.Logger(AiService_1.name);
    client;
    constructor() {
        this.client = new client_bedrock_runtime_1.BedrockRuntimeClient({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        });
    }
    async extractVocabulary(imageBuffer) {
        const prompt = `Analyze the attached image of a book page.
OCR the text.
Identify 5-10 vocabulary words suitable for a B1-level English learner (ignore common A1/A2 words).
For each word, return a JSON object with:
word: The vocabulary word.
definition: A simple, clear definition fitting the context.
context: The exact sentence from the text where the word appears.
image_query: A short, descriptive 3-4 word search query to find a visual representation of this word (e.g., 'dictator speaking podium' for 'demagogue').
Return ONLY a JSON array.`;
        const payload = {
            anthropic_version: 'bedrock-2023-05-31',
            max_tokens: 2000,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image',
                            source: {
                                type: 'base64',
                                media_type: 'image/jpeg',
                                data: imageBuffer.toString('base64'),
                            },
                        },
                        {
                            type: 'text',
                            text: prompt,
                        },
                    ],
                },
            ],
        };
        const command = new client_bedrock_runtime_1.InvokeModelCommand({
            modelId: 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify(payload),
        });
        try {
            const response = await this.client.send(command);
            const responseBody = JSON.parse(new TextDecoder().decode(response.body));
            const content = responseBody.content[0].text;
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('No JSON array found in response');
        }
        catch (error) {
            this.logger.error('Error invoking Bedrock model', error);
            throw error;
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AiService);
//# sourceMappingURL=ai.service.js.map