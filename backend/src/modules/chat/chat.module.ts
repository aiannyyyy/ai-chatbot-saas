import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { GroqService } from './services/groq.service';
import { ChatbotModule } from '../chatbot/chatbot.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
    ]),
    ChatbotModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, GroqService],
})
export class ChatModule {}