import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import coffeesConfig from './config/coffees.config';

import { COFFEE_BRANDS } from './tokens/coffee-brands.token';

import { Coffee, CoffeeMongoose } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event, EventMongoose } from '../events/entities/event.entity';

import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable({ scope: Scope.DEFAULT })
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly _coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly _flavorRepository: Repository<Flavor>,
    private readonly _dataSource: DataSource,
    @Inject(COFFEE_BRANDS) coffeeBrands: string[],
    private readonly _configService: ConfigService,
    @Inject(coffeesConfig.KEY)
    private readonly _coffeesConfiguration: ConfigType<typeof coffeesConfig>,
  ) {
    console.log(coffeeBrands);
    console.log(this._configService.get('coffees'));
    console.log(this._coffeesConfiguration.foo);
  }

  private async _preloadFlavorsByName(name: string): Promise<Flavor> {
    const existingFlavor = await this._flavorRepository.findOne({
      where: { name },
    });

    if (existingFlavor) return existingFlavor;

    return this._flavorRepository.create({ name });
  }

  async findAll(paginationQuery: PaginationDto) {
    const { limit, offset } = paginationQuery;
    return await this._coffeeRepository.find({
      skip: offset,
      take: limit,
      relations: { flavors: true },
    });
  }

  async findOne(id: string) {
    const coffee = await this._coffeeRepository.findOne({
      where: { id: +id },
      relations: {
        flavors: true,
      },
    });

    if (!coffee) throw new NotFoundException(`Coffee #${id} not found`);

    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this._preloadFlavorsByName(name)),
    );
    const coffee = this._coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this._coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this._preloadFlavorsByName(name)),
      ));

    const coffee = await this._coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) throw new NotFoundException(`Coffee #${id} not found`);
    return this._coffeeRepository.save(coffee);
  }

  async remove(id: string) {
    const coffee = await this.findOne(id);
    return this._coffeeRepository.remove(coffee);
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this._dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

@Injectable({ scope: Scope.DEFAULT })
export class CoffeesServiceMongoose {
  constructor(
    @InjectModel(CoffeeMongoose.name)
    private readonly _coffeeModel: Model<CoffeeMongoose>,
    @InjectModel(EventMongoose.name)
    private readonly eventModel: Model<EventMongoose>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findAll(paginationQuery: PaginationDto) {
    const { limit, offset } = paginationQuery;
    return this._coffeeModel.find().skip(offset).limit(limit).exec();
  }

  async findOne(id: string) {
    const coffee = await this._coffeeModel.findOne({ _id: id }).exec();
    if (!coffee) throw new NotFoundException(`Coffee #${id} not found`);

    await this.recommendCoffee(coffee);

    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = new this._coffeeModel(createCoffeeDto);
    return coffee.save();
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const coffee = await this._coffeeModel
      .findOneAndUpdate(
        { _id: id },
        {
          $set: updateCoffeeDto,
        },
        { new: true },
      )
      .exec();

    if (!coffee) throw new NotFoundException(`Coffee #${id} not found`);

    return coffee;
  }

  async remove(id: string) {
    const coffee = await this.findOne(id);
    return (await coffee.deleteOne({ new: true })).deletedCount;
  }

  async recommendCoffee(coffee: CoffeeMongoose) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      coffee.recommendations++;

      const recommendEvent = new this.eventModel({
        name: 'recommend_coffee',
        type: 'coffee',
        payload: { coffeeId: coffee.id },
      });

      await recommendEvent.save({ session });
      await coffee.save({ session });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}
