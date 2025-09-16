import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15, { message: 'SKU must be at most 15 characters long' })
  sku: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100, {
    message: 'Product name must be at most 100 characters long',
  })
  name: string;

  @IsOptional()
  @IsString()
  description: string | null;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20, { message: 'Category must be at most 15 characters long' })
  category: string;
}
