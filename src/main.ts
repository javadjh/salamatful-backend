import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Salamatful API')
    .setDescription('Documention API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(bodyParser.json({ limit: '256mb' }));
  app.use(bodyParser.urlencoded({ limit: '256mb', extended: true }));
  process.env.NODE_ENV = 'development';
  await app.listen(3022);
}
bootstrap();
