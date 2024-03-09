import { DataSource } from 'typeorm';

import { Coffee } from 'src/coffees/entities/coffee.entity';
import { Flavor } from 'src/coffees/entities/flavors.entity';

import { SchemaSynch1709965252160 } from 'src/migrations/1709965252160-SchemaSynch';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'root',
  database: 'iluvcoffee-db',
  entities: [Coffee, Flavor],
  migrations: [SchemaSynch1709965252160],
});
