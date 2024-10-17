import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation for Crypto Companion App')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('apidocs', app, document);

  app.enableCors({})
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
