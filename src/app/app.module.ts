import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as Joi from '@hapi/joi';

import { CoffeesModule } from '../coffees/coffees.module';
import { CoffeeRatingModule } from '../coffee-rating/coffee-rating.module';
import { CommonModule } from '../common/common.module';

import { AppService } from './app.service';

import { AppController } from './app.controller';

import appConfig from '../config/app.config';

type JoiValidationSchema =
  | {
      DB_HOST: Joi.StringSchema;
      DB_PORT: Joi.NumberSchema;
      DB_NAME: Joi.StringSchema;
      DB: Joi.StringSchema;
    }
  | {
      DB_HOST: Joi.StringSchema;
      DB_PORT: Joi.NumberSchema;
      DB_USER: Joi.StringSchema;
      DB_PASS: Joi.StringSchema;
      DB_NAME: Joi.StringSchema;
      DB: Joi.StringSchema;
    };

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        database: process.env.DB_NAME,
        synchronize: true,
        ...(process.env.DB === 'mongo'
          ? {
              type: 'mongodb',
              namingStrategy: new SnakeNamingStrategy(),
            }
          : {
              type: 'postgres',
              autoLoadEntities: true,
              username: process.env.DB_USER,
              password: process.env.DB_PASS,
            }),
      }),
    }),
    ConfigModule.forRoot({
      load: [appConfig],
      validationSchema: Joi.object({
        DB: Joi.string().valid('mongo', 'postgres'),

        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string(),
        DB_PASS: Joi.string(),
      }) satisfies Joi.ObjectSchema<JoiValidationSchema>,
    }),
    CoffeesModule,
    CoffeeRatingModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
