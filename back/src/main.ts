import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { LoggerService } from './shared/logging/logger.service';
import { LoggingInterceptor } from './shared/logging/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Configurar logger customizado
  const loggerService = app.get(LoggerService);
  app.useLogger(loggerService);

  // Configurar interceptor de logging
  app.useGlobalInterceptors(new LoggingInterceptor(loggerService));

  // Log de inicialização da aplicação
  loggerService.log('Starting application bootstrap', {
    type: 'application_startup',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
  });

  // Configuração CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Farmers API')
    .setDescription('API for managing farmers')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    forbidNonWhitelisted: true,
    whitelist: true,
    exceptionFactory: (errors) => {
      const messages = errors.map(error =>
        Object.values(error.constraints || {}).join(', ')
      ).join('; ');
      return new BadRequestException(messages);
    },
  }));

  // Aplicar filtro de exceção global
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  loggerService.log(`Application started successfully`, {
    type: 'application_ready',
    port,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
}
bootstrap();
