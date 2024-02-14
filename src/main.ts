import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4000',
    allowedHeaders: 'Content-Type',
  });
  await app
    .listen(3000)
    .then(() => console.log('http://localhost:3000/graphql'));
}
bootstrap();
