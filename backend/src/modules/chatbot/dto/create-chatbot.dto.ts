import { IsString, IsOptional, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class CreateChatbotDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(200)
  description: string;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  instructions: string;

  @IsString()
  @IsOptional()
  model?: string;
}