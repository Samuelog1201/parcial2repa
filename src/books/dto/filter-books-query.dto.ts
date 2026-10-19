import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

// Completed reference. Query validation is not a task in this exercise.
export class FilterBooksQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  limit: number = 5;
}
