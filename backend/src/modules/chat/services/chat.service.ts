import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';
import { SendMessageDto } from '../dto/send-message.dto';
import { GroqService } from './groq.service';
import { ChatbotService } from '../../chatbot/services/chatbot.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private groqService: GroqService,
    private chatbotService: ChatbotService,
  ) {}

  async sendMessage(
    chatbotId: string,
    sendMessageDto: SendMessageDto,
    userId: string,
  ) {
    // Verify chatbot belongs to user
    const chatbot = await this.chatbotService.findOne(chatbotId, userId);
    if (!chatbot) throw new NotFoundException('Chatbot not found');

    // Get chat history for context
    const history = await this.messageModel
      .find({ chatbotId, userId })
      .sort({ createdAt: 1 })
      .limit(20);

    // Build messages array for Groq
    const messages: {
      role: 'user' | 'assistant' | 'system';
      content: string;
    }[] = [
      // System message with chatbot instructions
      {
        role: 'system',
        content: chatbot.instructions,
      },
      // Previous chat history
      ...history.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      // New user message
      {
        role: 'user',
        content: sendMessageDto.content,
      },
    ];

    // Save user message to DB
    await this.messageModel.create({
      chatbotId: new Types.ObjectId(chatbotId),
      userId: new Types.ObjectId(userId),
      role: 'user',
      content: sendMessageDto.content,
    });

    // Get AI response from Groq
    const aiResponse = await this.groqService.generateResponse(
      messages,
      chatbot.model,
    );

    // Save AI response to DB
    const assistantMessage = await this.messageModel.create({
      chatbotId: new Types.ObjectId(chatbotId),
      userId: new Types.ObjectId(userId),
      role: 'assistant',
      content: aiResponse,
    });

    return {
      message: assistantMessage,
      response: aiResponse,
    };
  }

  async getChatHistory(chatbotId: string, userId: string) {
    // Verify chatbot belongs to user
    await this.chatbotService.findOne(chatbotId, userId);

    const messages = await this.messageModel
      .find({ chatbotId, userId })
      .sort({ createdAt: 1 });

    return messages;
  }

  async clearHistory(chatbotId: string, userId: string) {
    await this.chatbotService.findOne(chatbotId, userId);

    await this.messageModel.deleteMany({
      chatbotId: new Types.ObjectId(chatbotId),
      userId: new Types.ObjectId(userId),
    });

    return { message: 'Chat history cleared successfully' };
  }
}