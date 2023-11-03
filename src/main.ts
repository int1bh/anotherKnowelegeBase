import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { urlencoded, json } from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ForbiddenExceptionFilter } from './common/filter/forbidden-exception-filter';
import * as passport from 'passport';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.use(
      session({
          secret: 'keyboard',
          resave: false,
          saveUninitialized: false,
      }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  app.enableCors({
    credentials: true,
    origin: true
  });
  app.setGlobalPrefix('api');

  // включим свою обработку для ForbiddenException
  app.useGlobalFilters(new ForbiddenExceptionFilter());

  // создадим страницу с API для всего
  SwaggerModule.setup(
      '/docs',
      app,
      SwaggerModule.createDocument(
          app,
          new DocumentBuilder()
              .setTitle('Описание Api')
              .setDescription('Описание сервисов для работы')
              .setVersion('1.0')
              .build()
      ),
      {
        swaggerOptions: {
          docExpansion: 'none',
          operationsSorter: 'alpha',
          tagsSorter: 'alpha',
          displayRequestDuration: true
        }
      }
  );
  await app.listen(80);
  Logger.log(`Запустили http сервер. swagger доступен на http://localhost/docs`);
}
bootstrap();
