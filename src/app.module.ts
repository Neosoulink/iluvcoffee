import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

import { CoffeesModule } from './coffees/coffees.module';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { CommonModule } from './common/modules/common.module';
import { DatabaseModule } from './common/modules/database.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      validationSchema: Joi.object({
        DB: Joi.string()
          .valid('mongo', 'mongo_mongoose', 'postgres')
          .required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
      }),
    }),
    DatabaseModule.forRootAsync(),
    CoffeesModule,
    CoffeeRatingModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
