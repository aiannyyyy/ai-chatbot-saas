import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { SendMessageDto } from '../dto/send-message.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { UserDocument } from '../../users/schemas/user.schema';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post(':chatbotId')
  sendMessage(
    @Param('chatbotId') chatbotId: string,
    @Body() sendMessageDto: SendMessageDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.chatService.sendMessage(
      chatbotId,
      sendMessageDto,
      user._id.toString(),
    );
  }

  @Get(':chatbotId')
  getChatHistory(
    @Param('chatbotId') chatbotId: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.chatService.getChatHistory(chatbotId, user._id.toString());
  }

  @Delete(':chatbotId')
  clearHistory(
    @Param('chatbotId') chatbotId: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.chatService.clearHistory(chatbotId, user._id.toString());
  }
}