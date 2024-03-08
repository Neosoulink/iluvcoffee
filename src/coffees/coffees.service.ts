import { Injectable, NotFoundException } from '@nestjs/common';

import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Coffee name',
      brand: 'Brand name',
      flavors: ['chocolate', 'valilla'],
    },
  ];

  findAll() {
    return this.coffees;
  }

  findOne(id: string) {
    const coffee = this.coffees.find((item) => item.id === +id);

    if (!coffee) throw new NotFoundException(`Coffee #${id} not found`);

    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto) {
    return this.coffees.push({ ...createCoffeeDto, id: this.coffees.length });
  }

  update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const existingCoffee = this.findOne(id);
    console.log(updateCoffeeDto);

    if (!existingCoffee) throw new NotFoundException(`Coffee #${id} not found`);

    if (existingCoffee) {
      // update here
      return updateCoffeeDto;
    }
  }

  remove(id: string) {
    const coffeeIndex = this.coffees.findIndex((item) => item.id === +id);

    if (coffeeIndex >= 0) return this.coffees.splice(coffeeIndex, 1).length;

    return this.coffees.length;
  }
}
