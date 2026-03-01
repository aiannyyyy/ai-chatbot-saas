import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class GroqService {
  private groq: Groq;

  constructor(private configService: ConfigService) {
    this.groq = new Groq({
      apiKey: this.configService.get<string>('groq.apiKey'),
    });
  }

  async generateResponse(
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
    model: string = 'llama-3.3-70b-versatile',
  ): Promise<string> {
    const completion = await this.groq.chat.completions.create({
      messages,
      model,
      max_tokens: 1024,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content ?? 'No response generated';
  }
}