import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { COFFEE_BRANDS } from './tokens/coffee-brands.token';

import coffeesConfig from './config/coffees.config';

import { CoffeesService } from './coffees.service';

import { Flavor } from './entities/flavor.entity';
import { Coffee } from './entities/coffee.entity';
import { Event } from '../events/entities/event.entity';

describe('CoffeesService', () => {
  let service: CoffeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(Flavor), useValue: {} },
        { provide: getRepositoryToken(Coffee), useValue: {} },
        { provide: getRepositoryToken(Event), useValue: {} },
        {
          provide: ConfigService,
          useValue: {
            get: () => {},
          },
        },
        { provide: COFFEE_BRANDS, useValue: {} },
        { provide: coffeesConfig.KEY, useValue: {} },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
