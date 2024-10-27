import { DataSource } from 'typeorm';

import { Coffee } from 'src/coffees/entities/coffee.entity';
import { Flavor } from 'src/coffees/entities/flavor.entity';
import { Event } from 'src/events/entities/event.entity';

import { SchemaSynch1709965252160 } from 'src/migrations/1709965252160-SchemaSynch';
import { SchemaSync1730044738715 } from 'src/migrations/1730044738715-SchemaSync';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'root',
  password: 'root',
  database: 'iluvcoffee-db',
  entities: [Coffee, Flavor, Event],
  migrations: [SchemaSynch1709965252160, SchemaSync1730044738715],
});
