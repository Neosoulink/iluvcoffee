import { Module } from '@nestjs/common';
import { ConfigModule as NativeConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

import appConfig from 'src/config/app.config';

@Module({
  imports: [
    NativeConfigModule.forRoot({
      load: [appConfig],
      validationSchema: Joi.object({
        DB_TYPE: Joi.string()
          .valid('mongo', 'mongo_mongoose', 'postgres')
          .required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5433),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
      }),
    }),
  ],
})
export class ConfigModule {}
