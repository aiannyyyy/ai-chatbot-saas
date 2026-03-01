import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import type { UserDocument } from '../../users/schemas/user.schema';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: UserDocument) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      messagesUsed: user.messagesUsed,
      messagesLimit: user.messagesLimit,
    };
  }
}