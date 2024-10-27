import { Module } from '@nestjs/common';

import { ConfigModule } from './common/modules/config.module';
import { DatabaseModule } from './common/modules/database.module';
import { CoffeesModule } from './coffees/coffees.module';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { GlobalModule } from './common/modules/global.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule.forRootAsync(),
    CoffeesModule.forRootAsync(),
    CoffeeRatingModule.forRootAsync(),
    GlobalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
