import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Custom Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // Security
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP if it interferes with dev/inline scripts for now
    }),
  );

  app.enableCors({
    origin: (() => {
      const origins = process.env.ALLOWED_ORIGINS;
      if (!origins) {
        if (process.env.NODE_ENV === 'production') {
          throw new Error('ALLOWED_ORIGINS is required in production');
        }
        return true; // dev: allow all
      }
      return origins.split(',').map(o => o.trim());
    })(),
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
