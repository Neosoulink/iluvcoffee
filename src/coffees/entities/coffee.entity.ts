import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Flavor } from './flavor.entity';
import appConfig from 'src/config/app.config';

@Entity()
@Index(['name', 'brand'])
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  recommendations: number;

  @JoinTable()
  @ManyToMany(
    () => Flavor,
    appConfig().db.type === 'postgres' ? (flavor) => flavor.coffees : undefined,
    { cascade: true },
  )
  flavors: Flavor[];
}

@Schema({ collection: 'coffee' })
export class CoffeeMongoose extends Document {
  @Prop()
  name: string;

  @Prop()
  brand: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: 0 })
  recommendations: number;

  @Prop([String])
  flavors: string[];
}

export const CoffeeSchema = SchemaFactory.createForClass(CoffeeMongoose);
