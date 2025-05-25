import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(3000);
  console.log('Server running on http://localhost:3000/graphql');
  console.log('Check if mongodb is running on mongodb://localhost:27017');
}
bootstrap();
