import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChatbotDocument = HydratedDocument<Chatbot>;

@Schema({ timestamps: true })
export class Chatbot {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, trim: true })
  instructions: string;

  @Prop({ default: 'llama-3.3-70b-versatile' })
  model: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const ChatbotSchema = SchemaFactory.createForClass(Chatbot);