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
import {
  Event,
  EventMongoose,
  EventSchema,
} from '../events/entities/event.entity';

import appConfig from '../../src/config/app.config';

const currentModule =
  appConfig().db.type === 'mongo_mongoose'
    ? MongooseModule.forFeature([
        { name: CoffeeMongoose.name, schema: CoffeeSchema },
        { name: EventMongoose.name, schema: EventSchema },
      ])
    : TypeOrmModule.forFeature([Coffee, Flavor, Event]);

const currentController =
  appConfig().db.type === 'mongo_mongoose'
    ? CoffeesControllerMongoose
    : CoffeesController;

const currentService =
  appConfig().db.type === 'mongo_mongoose'
    ? CoffeesServiceMongoose
    : CoffeesService;

@Module({})
export class CoffeesModule {
  static async forRootAsync(): Promise<DynamicModule> {
    return {
      module: CoffeesModule,
      imports: [currentModule, ConfigModule.forFeature(coffeesConfig)],
      controllers: [currentController],
      providers: [
        currentService,
        {
          provide: COFFEE_BRANDS,
          useFactory: () => ['chocolate', 'vanilla'],
          scope: Scope.TRANSIENT,
        },
      ],
      exports: [currentService],
    };
  }
}
