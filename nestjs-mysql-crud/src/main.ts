import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './interceptors/exception.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const options = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription(
      'This API handles user authentication, profile management, and role-based access.',
    )
    .setVersion('1.0.0')
    .addServer('http://localhost:3000/', 'Local environment')
    // .addServer('https://staging.myapp.com/', 'Staging')
    // .addServer('https://api.myapp.com/', 'Production')
    .addTag('Users')
    .addTag('Authentication')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
