import { Module } from '@nestjs/common';

import { AppService } from './app.service';

import { AppController } from './app.controller';
import { CoffeesController } from '../coffees/coffees.controller';

@Module({
  imports: [],
  controllers: [AppController, CoffeesController],
  providers: [AppService],
})
export class AppModule {}
