import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  // Global API prefix
  app.setGlobalPrefix('api');

  await app.listen(port);
  console.log(`🚀 Server running on: http://localhost:${port}`);
  console.log(`📡 API available at: http://localhost:${port}/api`);
}
bootstrap();