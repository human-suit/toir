import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import type { INestApplication } from '@nestjs/common';
import type { OpenAPIObject } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);

  // CORS для React Admin
  app.enableCors({
    origin: '*',
    exposedHeaders: ['Content-Range'],
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('TOIR API')
    .setDescription('Maintenance system API')
    .setVersion('1.0')
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  // запуск сервера
  await app.listen(3000);
}

void bootstrap();
