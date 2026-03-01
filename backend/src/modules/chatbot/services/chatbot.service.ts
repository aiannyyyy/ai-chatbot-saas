import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chatbot, ChatbotDocument } from '../schemas/chatbot.schema';
import { CreateChatbotDto } from '../dto/create-chatbot.dto';
import { UpdateChatbotDto } from '../dto/update-chatbot.dto';

@Injectable()
export class ChatbotService {
  constructor(
    @InjectModel(Chatbot.name) private chatbotModel: Model<ChatbotDocument>,
  ) {}

  async create(
    createChatbotDto: CreateChatbotDto,
    userId: string,
  ): Promise<ChatbotDocument> {
    const chatbot = new this.chatbotModel({
      ...createChatbotDto,
      userId: new Types.ObjectId(userId),
    });
    return chatbot.save();
  }

  async findAll(userId: string): Promise<ChatbotDocument[]> {
    return this.chatbotModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findOne(id: string, userId: string): Promise<ChatbotDocument> {
    const chatbot = await this.chatbotModel.findById(id);
    if (!chatbot) throw new NotFoundException('Chatbot not found');
    if (chatbot.userId.toString() !== userId)
      throw new ForbiddenException('Access denied');
    return chatbot;
  }

  async update(
    id: string,
    updateChatbotDto: UpdateChatbotDto,
    userId: string,
  ): Promise<ChatbotDocument> {
    const chatbot = await this.findOne(id, userId);
    Object.assign(chatbot, updateChatbotDto);
    return chatbot.save();
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    await this.findOne(id, userId);
    await this.chatbotModel.findByIdAndDelete(id);
    return { message: 'Chatbot deleted successfully' };
  }
}