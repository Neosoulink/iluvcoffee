import { DynamicModule, Module } from '@nestjs/common';
import { CoffeesModule } from '../coffees/coffees.module';
import { CoffeeRatingService } from './coffee-rating.service';

@Module({})
export class CoffeeRatingModule {
  static async forRootAsync(): Promise<DynamicModule> {
    return {
      module: CoffeeRatingModule,
      imports: [CoffeesModule.forRootAsync()],
      providers: [CoffeeRatingService],
    };
  }
}
