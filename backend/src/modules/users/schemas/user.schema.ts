import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: 'free' })
  plan: string;

  @Prop({ default: 0 })
  messagesUsed: number;

  @Prop({ default: 50 })
  messagesLimit: number;
}

export const UserSchema = SchemaFactory.createForClass(User);