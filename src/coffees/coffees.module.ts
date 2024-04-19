import { DynamicModule, Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import {
  CoffeesController,
  CoffeesControllerMongoose,
} from './coffees.controller';

import { CoffeesService, CoffeesServiceMongoose } from './coffees.service';

import { COFFEE_BRANDS } from './tokens/coffee-brands.token';

import coffeesConfig from './config/coffees.config';

import { Coffee, CoffeeMongoose, CoffeeSchema } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';

import appConfig from '../../src/config/app.config';

@Module({})
export class CoffeesModule {
  static async forRootAsync(): Promise<DynamicModule> {
    return {
      module: CoffeesModule,
      imports: [
        (() =>
          appConfig().db.type === 'mongo_mongoose'
            ? MongooseModule.forFeature([
                { name: CoffeeMongoose.name, schema: CoffeeSchema },
              ])
            : TypeOrmModule.forFeature([Coffee, Flavor, Event]))(),
        ConfigModule.forFeature(coffeesConfig),
      ],
      controllers: [
        (() =>
          appConfig().db.type === 'mongo_mongoose'
            ? CoffeesControllerMongoose
            : CoffeesController)(),
      ],
      providers: [
        (() =>
          appConfig().db.type === 'mongo_mongoose'
            ? CoffeesServiceMongoose
            : CoffeesService)(),
        {
          provide: COFFEE_BRANDS,
          useFactory: () => ['chocolate', 'vanilla'],
          scope: Scope.TRANSIENT,
        },
      ],
      exports: [
        (() =>
          appConfig().db.type === 'mongo_mongoose'
            ? CoffeesServiceMongoose
            : CoffeesService)(),
      ],
    };
  }
}
