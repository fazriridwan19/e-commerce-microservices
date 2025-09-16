import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductVariantRequest {
    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @IsOptional()
    @IsNumber()
    variantId: number | null;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    value: string;

    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @IsNotEmpty()
    @IsNumber()
    price: number;
}