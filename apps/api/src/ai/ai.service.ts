import { Injectable, Logger } from '@nestjs/common';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

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
    const prompt = `Analyze the attached image of a book page.
OCR the text.
1. Identify the "page index" or location indicator. This often includes "time left" (e.g., "42 hrs 40 mins left in book") AND/OR a percentage (e.g., "15%"). Capture BOTH if present, separated by " | " (e.g., "42 hrs 40 mins left in book | 15%"). If only one is found, return that. If neither, use "Unknown Location".
2. Identify 5-10 vocabulary words suitable for a B1-level English learner (ignore common A1/A2 words).

Return a JSON object with this exact structure:
{
  "page_index": "The extracted location string",
  "vocabulary": [
    {
      "word": "The vocabulary word",
      "definition": "A simple, clear definition fitting the context",
      "context": "The exact sentence from the text where the word appears",
      "image_query": "A short, descriptive 3-4 word search query"
    }
  ]
}`;

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
                media_type: 'image/jpeg', // Assuming JPEG for now, can make dynamic
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

    const command = new InvokeModelCommand({
      modelId: 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });

    try {
      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const content = responseBody.content[0].text;
      
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON object found in response');
    } catch (error) {
      this.logger.error('Error invoking Bedrock model', error);
      throw error;
    }
  }
}
