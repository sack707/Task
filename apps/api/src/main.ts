import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global Prefix
  app.setGlobalPrefix('api');

  // Security & Middleware
  app.use(helmet({ contentSecurityPolicy: false }));
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Global Pipes & Interceptors & Filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Team Task Manager API')
    .setDescription('Production REST API specifications for Team Task Manager with Role-Based Access Control')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication and current user endpoints')
    .addTag('Users', 'User management and directory endpoints')
    .addTag('Projects', 'Project creation, updates, and deletion endpoints')
    .addTag('Tasks', 'Task management, assignment, and status endpoints')
    .addTag('Dashboard', 'Aggregated operational metrics and recent activity')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 API Server running on port ${port}`);
  logger.log(`📚 Swagger documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
