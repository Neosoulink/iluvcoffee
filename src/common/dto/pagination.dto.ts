import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  // @Type(() => Number)
  readonly limit: number;

  @IsOptional()
  @Min(0)
  // @Type(() => Number)
  readonly offset: number;
}
