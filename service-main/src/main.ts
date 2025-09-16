import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { ResponseInterceptor } from './app/interceptors/response.interceptor';
import helmet from 'helmet';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const moduleRef = app.select(AppModule);
  const reflector = moduleRef.get(Reflector);
  const configService = app.get(ConfigService);
  const serviceName = configService.get<string>('APP_NAME');
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.enableCors();
  app.use(helmet.hidePoweredBy());
  app.useGlobalInterceptors(new ResponseInterceptor(reflector, []));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      transform: true,
      validateCustomDecorators: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        let message = '';
        const queue = [...validationErrors];
        const uniqueErrors = new Set();

        while (queue.length > 0) {
          const error = queue.shift();

          if (!error) continue;

          const errorId = `${error.property}-${Object.keys(error.constraints || {}).join(',')}`;

          if (!uniqueErrors.has(errorId)) {
            uniqueErrors.add(errorId);
            if (error.constraints) {
              const messages = Object.values(error.constraints).join(', ');
              message += messages + ', ';
            }
            // if error has children, queue the children for processing
            if (error.children && error.children.length > 0) {
              queue.push(...error.children);
            }
          }
        }
        // Remove last comma and space
        message = message.slice(0, -2);
        return new BadRequestException(message || 'Validation failed');
      },
    }),
  );
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const port = configService.get<string>('APP_PORT');
  await app.listen(port ?? '4000');
  logger.log(`${serviceName} is running on port ${port}`);
}
bootstrap();
