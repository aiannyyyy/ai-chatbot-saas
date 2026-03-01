import { IsString, IsOptional, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class UpdateChatbotDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(200)
  description?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(1000)
  instructions?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}