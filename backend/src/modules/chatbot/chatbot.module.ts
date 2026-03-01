import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatbot, ChatbotSchema } from './schemas/chatbot.schema';
import { ChatbotController } from './controllers/chatbot.controller';
import { ChatbotService } from './services/chatbot.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chatbot.name, schema: ChatbotSchema }]),
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}