import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Allow requests from NextJS frontend
  app.setGlobalPrefix('api');

  // Port 3001 so it doesn't clash with Next.js on 3000
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
