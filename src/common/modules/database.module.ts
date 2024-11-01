import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import appConfig from '../../../src/config/app.config';

@Module({})
export class DatabaseModule {
  static async forRootAsync(): Promise<DynamicModule> {
    return {
      module: DatabaseModule,
      imports: [
        (() => {
          const config = appConfig();

          if (config.db.type === 'mongo_mongoose')
            return MongooseModule.forRootAsync({
              useFactory: () => ({
                uri: `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`,
              }),
            });

          return TypeOrmModule.forRootAsync({
            useFactory: () => {
              return {
                host: config.db.host,
                port: config.db.port,
                database: config.db.name,
                synchronize: true,
                autoLoadEntities: true,
                ...(config.db.type === 'mongo'
                  ? {
                      type: 'mongodb',
                      namingStrategy: new SnakeNamingStrategy(),
                      useUnifiedTopology: true,
                      useNewUrlParser: true,
                    }
                  : {
                      type: 'postgres',
                      username: config.db.user,
                      password: config.db.pass,
                    }),
              };
            },
          });
        })(),
      ],
    };
  }
}
