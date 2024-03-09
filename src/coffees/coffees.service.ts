import { Injectable, NotFoundException } from '@nestjs/common';

import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly _coffeeRepository: Repository<Coffee>,
  ) {}

  async findAll() {
    return await this._coffeeRepository.find({ relations: { flavors: true } });
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

  create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = this._coffeeRepository.create(createCoffeeDto);
    return this._coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const coffee = await this._coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
    });
    if (!coffee) throw new NotFoundException(`Coffee #${id} not found`);
    return this._coffeeRepository.save(coffee);
  }

  async remove(id: string) {
    const coffee = await this.findOne(id);
    return this._coffeeRepository.remove(coffee);
  }
}
