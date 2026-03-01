import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ChatbotService } from '../services/chatbot.service';
import { CreateChatbotDto } from '../dto/create-chatbot.dto';
import { UpdateChatbotDto } from '../dto/update-chatbot.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { UserDocument } from '../../users/schemas/user.schema';

@Controller('chatbot')
@UseGuards(JwtAuthGuard)
export class ChatbotController {
  constructor(private chatbotService: ChatbotService) {}

  @Post()
  create(
    @Body() createChatbotDto: CreateChatbotDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.chatbotService.create(createChatbotDto, user._id.toString());
  }

  @Get()
  findAll(@CurrentUser() user: UserDocument) {
    return this.chatbotService.findAll(user._id.toString());
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.chatbotService.findOne(id, user._id.toString());
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChatbotDto: UpdateChatbotDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.chatbotService.update(id, updateChatbotDto, user._id.toString());
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.chatbotService.remove(id, user._id.toString());
  }
}