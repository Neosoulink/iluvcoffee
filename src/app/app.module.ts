import { Module } from '@nestjs/common';

import { AppService } from './app.service';

import { AppController } from './app.controller';
import { CoffeesController } from '../coffees/coffees.controller';
import { CoffeesService } from 'src/coffees/coffees.service';

@Module({
  imports: [],
  controllers: [AppController, CoffeesController],
  providers: [AppService, CoffeesService],
})
export class AppModule {}
