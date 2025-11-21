import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly apiKey = process.env.SERPER_API_KEY;

  async searchImage(query: string): Promise<string | null> {
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
    } catch (error) {
      this.logger.error(`Error searching image for query "${query}"`, error);
      return null;
    }
  }
}
