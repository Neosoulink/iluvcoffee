import { Injectable, NotFoundException } from '@nestjs/common';

import { Coffee } from './entities/coffee.entity';

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

  create(createCoffeeDto) {
    return this.coffees.push(createCoffeeDto);
  }

  update(id: string) {
    const existingCoffee = this.findOne(id);

    if (existingCoffee) {
      // update here
      return '';
    }
  }

  remove(id: string) {
    const coffeeIndex = this.coffees.findIndex((item) => item.id === +id);

    if (coffeeIndex >= 0) return this.coffees.splice(coffeeIndex, 1).length;

    return this.coffees.length;
  }
}
