import { registerAs } from '@nestjs/config';

const config = () => ({
  environment: process.env.NODE_ENV || 'development',
  db: {
    type: process.env.DB_TYPE as 'mongo' | 'mongo_mongoose' | 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
  },
  api: {
    key: process.env.API_KEY,
  },
});

export const APP_CONFIG_KEY = 'app';
export const appConfig = registerAs(APP_CONFIG_KEY, config);
export default config;
