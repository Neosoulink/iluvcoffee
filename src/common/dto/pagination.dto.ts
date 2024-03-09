import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  // @Type(() => Number)
  readonly limit: number;

  @IsOptional()
  @IsPositive()
  // @Type(() => Number)
  readonly offset: number;
}
