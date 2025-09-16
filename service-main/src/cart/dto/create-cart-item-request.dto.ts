import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCartItemRequest {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNumber()
  @IsOptional()
  variantId?: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
