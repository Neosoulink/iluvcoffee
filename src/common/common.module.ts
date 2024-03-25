import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { HttpExceptionFilter } from './filters/hhtps-expections/http-exception.filter';

import { ApiKeyGuard } from './guards/api-key/api-key.guard';

import { WrapResponseInterceptor } from './interceptors/wrap-response/wrap-response.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout/timeout.interceptor';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    { provide: APP_GUARD, useClass: ApiKeyGuard },
    { provide: APP_INTERCEPTOR, useClass: WrapResponseInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
  ],
})
export class CommonModule {}
