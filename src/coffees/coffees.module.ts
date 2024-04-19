import { Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { CoffeesController } from './coffees.controller';

import { CoffeesService } from './coffees.service';

import { COFFEE_BRANDS } from './tokens/coffee-brands.token';

import coffeesConfig from './config/coffees.config';

import { Coffee, CoffeeMongoose, CoffeeSchema } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [
    process.env.DB === 'mongo_mongoose'
      ? MongooseModule.forFeature([
          { name: CoffeeMongoose.name, schema: CoffeeSchema },
        ])
      : TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    ConfigModule.forFeature(coffeesConfig),
  ],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    {
      provide: COFFEE_BRANDS,
      useFactory: () => ['chocolate', 'vanilla'],
      scope: Scope.TRANSIENT,
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
