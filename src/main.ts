import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RapidApiGuard } from './common/guards/rapid-api.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Kairos API')
    .setDescription('The Headless Inventory Engine for Developers')
    .setVersion('1.0')
    .addTag('Organizations')
    .addTag('Inventory')
    .addApiKey({ type: 'apiKey', name: 'x-rapidapi-proxy-secret', in: 'header' }, 'rapid-api-secret')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalGuards(new RapidApiGuard());

  await app.listen(3000);
  console.log(`Kairos API is running on: http://localhost:3000/v1`);
  console.log(`Swagger Docs available at: http://localhost:3000/docs`); // Link directo
}
bootstrap();
