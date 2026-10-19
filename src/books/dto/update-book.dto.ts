import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

// Already completed. General updates are not part of the exercise.
export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  title?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  availableCopies?: number;
}
