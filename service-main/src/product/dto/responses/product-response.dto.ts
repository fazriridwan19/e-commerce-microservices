import { ProductVariantResponse } from "./product-variant-response.dto";

export class ProductResponseDto {
  id: number;
  sku: string;
  name: string | null;
  description: string | null;
  price: number | null;
  stock: number | null;
  category: string | null;
  totalPriceCharge: number;
  variants: ProductVariantResponse[];
}   