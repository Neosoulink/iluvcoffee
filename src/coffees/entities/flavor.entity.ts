import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Coffee } from './coffee.entity';

import appConfig from 'src/config/app.config';

@Entity()
export class Flavor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(
    () => Coffee,
    appConfig().db.type === 'postgres' ? (coffee) => coffee.flavors : undefined,
  )
  coffees: Coffee[];
}
