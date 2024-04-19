import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Index(['name', 'type'])
@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Index()
  @Column()
  name: string;

  @Column('json')
  payload: Record<string, any>;
}

@Schema({ collection: 'event' })
export class EventMongoose {
  @Prop()
  type: string;

  @Prop()
  name: string;

  @Prop({ type: mongoose.SchemaTypes.Mixed })
  payload: Record<string, any>;
}

export const EventSchema = SchemaFactory.createForClass(EventMongoose);
