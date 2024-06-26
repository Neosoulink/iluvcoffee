import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { Flavor } from '../entities/flavor.entity';

export class CreateCoffeeDto {
  @ApiProperty({ description: 'Coffee name.' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Coffee brand' })
  @IsString()
  readonly brand: string;

  @ApiProperty({ example: [] })
  @IsString({ each: true })
  readonly flavors: Flavor['name'][];
}
