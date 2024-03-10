import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavors.entity';
import { Event } from 'src/events/entities/event.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { COFFEE_BRANDS } from './tokens/coffee-brands.token';

@Injectable({ scope: Scope.DEFAULT })
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly _coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly _flavorRepository: Repository<Flavor>,
    private readonly _dataSource: DataSource,
    @Inject(COFFEE_BRANDS) coffeeBrands: string[],
  ) {
    coffeeBrands;
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
