import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Validation
    app.useGlobalPipes(new ValidationPipe());
    app.use('/public', express.static(join(__dirname, '../', 'public')));


    const configService = app.get(ConfigService);
    const nestConfig = configService.get('nest');
    const corsConfig = configService.get('cors');
    const swaggerConfig = configService.get('swagger');

    // Swagger Api
    if (swaggerConfig.enabled) {
      const options = new DocumentBuilder()
        .setTitle('Global World API')
        .setDescription('The Global World API description')
        .setVersion('1.0')
        .addTag('Global World')
        .addBearerAuth()
        .build();
      const document = SwaggerModule.createDocument(app, options);

      SwaggerModule.setup(swaggerConfig.path || 'api', app, document);
    }

    if (corsConfig.enabled) {
      app.enableCors();
    }

    const port = process.env.PORT || nestConfig.port || 5000;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('Application failed to start:', error);
    process.exit(1);
  }
}

bootstrap();