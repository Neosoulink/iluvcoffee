import { Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { CoffeesController } from './coffees.controller';

import { CoffeesService } from './coffees.service';

import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavors.entity';
import { Event } from '../events/entities/event.entity';

import { COFFEE_BRANDS } from './tokens/coffee-brands.token';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event]), ConfigModule],
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
