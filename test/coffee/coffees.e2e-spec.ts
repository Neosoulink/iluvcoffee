import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';

import { CoffeesModule } from '../../src/coffees/coffees.module';
import { CreateCoffeeDto } from '../../src/coffees/dto/create-coffee.dto';
import { UpdateCoffeeDto } from '../../src/coffees/dto/update-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  const coffee: CreateCoffeeDto = {
    name: 'Coffee Name',
    brand: 'Coffee Brand',
    flavors: ['chocolate'],
  };
  const expectedPartialCoffee = expect.objectContaining({
    ...coffee,
    flavors: expect.arrayContaining(
      coffee.flavors.map((name) => expect.objectContaining({ name })),
    ),
  });
  let app: INestApplication;
  let httpServer: ReturnType<(typeof app)['getHttpServer']>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5434,
          username: 'root',
          password: 'root',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
  });

  it('Create [POST /]', async () => {
    const { body } = await request(httpServer)
      .post('/coffees')
      .send(coffee)
      .expect(HttpStatus.CREATED);
    expect(body).toEqual(expectedPartialCoffee);
  });

  it('Get all [GET /]', async () => {
    const { body } = await request(httpServer).get('/coffees');
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toEqual(expectedPartialCoffee);
  });

  it('Get one [GET /:id]', async () => {
    const { body } = await request(httpServer).get('/coffees/1');
    expect(body).toEqual(expectedPartialCoffee);
  });

  it('Update one [PATCH /:id]', async () => {
    const updateCoffeeDto: UpdateCoffeeDto = {
      ...coffee,
      name: 'New and Improved Shipwreck Roast',
    };
    const { body } = await request(httpServer)
      .patch('/coffees/1')
      .send(updateCoffeeDto);
    expect(body.name).toEqual(updateCoffeeDto.name);
    const { body: body_1 } = await request(httpServer).get('/coffees/1');
    expect(body_1.name).toEqual(updateCoffeeDto.name);
  });

  it('Delete one [DELETE /:id]', async () => {
    await request(httpServer).delete('/coffees/1').expect(HttpStatus.OK);
    return await request(httpServer)
      .get('/coffees/1')
      .expect(HttpStatus.NOT_FOUND);
  });

  afterAll(async () => {
    await app.close();
  });
});
