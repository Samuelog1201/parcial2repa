import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateBookDto {
  // Primero valido que el título sea texto, no esté vacío y no supere los 80 caracteres.
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  title!: string;

  // Acepto cero copias, pero exijo un número entero dentro del rango permitido.
  @IsInt()
  @Min(0)
  @Max(20)
  availableCopies!: number;

  // Exijo un identificador entero positivo para relacionar el libro con su categoría.
  @IsInt()
  @Min(1)
  categoryId!: number;
}
