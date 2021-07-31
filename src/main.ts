import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {HttpExceptionFilter} from "./http-exception.filter";
import {ValidationPipe} from "@nestjs/common";
import path from 'path';
import {NestExpressApplication} from "@nestjs/platform-express";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // <NestExpressApplication> 제너릭을 해줌으로써 fastify 를 쓰지 않고 express 쓰겠다고 명시해줌.
  const port = process.env.PORT || 3000;
  console.log(`Listening on port ${port}`);
  // Global
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // 이 옵션을 활성화 해줌으로써 @Param, @Query 에 ParseIntPipe 없이도 number 타입 같은 것으로 변환 가능함(대신 npm i class-transformer 설치해줘야함)
  }));
  app.useGlobalFilters(new HttpExceptionFilter());

  // static & upload
  if (process.env.NODE_ENV === 'production') {
    app.enableCors({
      origin: ['https://beestock.co.kr'],
      credentials: true,
    });
    app.useStaticAssets(path.join(__dirname, '..', '..', 'uploads'), { prefix: '/uploads', }); // useStaticAssets 이게 없다고 에러가 나면 위에 await NestFactory.create<NestExpressApplication>(AppModule); 제너릭 명시해주자
    app.useStaticAssets(path.join(__dirname, '..', '..', 'public'), { prefix: '/dist' });
  } else {
    app.enableCors({
      origin: true,
      credentials: true,
    });
    app.useStaticAssets(path.join(__dirname, '..', 'uploads'), { prefix: '/uploads', });
    app.useStaticAssets(path.join(__dirname, '..', 'public'), { prefix: '/dist' });
  }

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Henry API')
    .setDescription('Henry API Document')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Session config
  app.use(cookieParser());
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session()); // 만약 JWT 기반이라면 필요없음

  await app.listen(port);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
