import { Injectable, Logger } from '@nestjs/common';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { z } from 'zod';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly client: BedrockRuntimeClient;

  constructor() {
    this.client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async extractVocabulary(imageBuffer: Buffer): Promise<any> {
    const prompt = `
Analyze the attached image of a book page. OCR the text.

IMPORTANT TASKS:
1. **Find the page location**: Look for progress indicators like "42 hrs 40 mins left in book", "15%", "Page 123", or "Loc 2431". If you find multiple indicators, combine them with " | ". If none found, use "Unknown Location".
2. **Extract vocabulary**: Identify 5-10 words at B1+ level (intermediate/advanced English).

Return ONLY a valid JSON object with this EXACT structure (no extra text):
{
  "page_index": "42 hrs 40 mins left in book | 15%",
  "vocabulary": [
    {
      "word": "example",
      "definition": "a thing characteristic of its kind",
      "context": "This is an example sentence from the book.",
      "vn_translation": "ví dụ",
      "image_query": "A short, descriptive 5-10 word search query that support to easy understand the word & related to the context"
    }
  ]
}

CRITICAL: The "page_index" field MUST be at the root level of the JSON object, NOT inside the vocabulary array.`;

    const command = new InvokeModelCommand({
      modelId: "global.anthropic.claude-sonnet-4-5-20250929-v1:0", // Updated modelId
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: 'image/jpeg', // Assuming JPEG, using original media_type
                  data: imageBuffer.toString('base64'), // Using imageBuffer
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    try {
      const result = await this.invokeBedrockWithRetry(command);
      return result;
    } catch (error) {
      this.logger.error('Error invoking Bedrock model', error);
      throw error;
    }
  }

  private async invokeBedrockWithRetry(
    command: InvokeModelCommand,
    maxRetries = 5,
    baseDelay = 1000,
  ): Promise<any> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.client.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const text = responseBody.content[0].text;

        this.logger.debug(`AI Response: ${text}`);

        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON found in response");
        }

        this.logger.debug(`Extracted JSON: ${jsonMatch[0]}`);

        const result = JSON.parse(jsonMatch[0]);
        
        this.logger.debug(`Parsed result.page_index: ${result.page_index}`);
        this.logger.debug(`Parsed result.vocabulary length: ${result.vocabulary?.length || 0}`);
        
        const pageIndex = result.page_index || 'Unknown Location';
        const vocabulary = result.vocabulary || [];

        // Validate structure with Zod
        const VocabularySchema = z.array(z.object({
          word: z.string(),
          definition: z.string(),
          context: z.string(),
          vn_translation: z.string().optional(),
          image_query: z.string().optional(),
        }));

        return {
          pageIndex: pageIndex,
          vocabulary: VocabularySchema.parse(vocabulary),
        };
      } catch (error) {
        const isThrottling = error.name === 'ThrottlingException' || 
                            error.$metadata?.httpStatusCode === 429;
        
        if (isThrottling && attempt < maxRetries) {
          // Exponential backoff with jitter
          const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
          this.logger.warn(
            `Bedrock rate limit hit. Retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries})`,
          );
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        throw error;
      }
    }
  }
}
