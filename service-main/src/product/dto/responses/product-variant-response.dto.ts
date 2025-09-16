export class ProductVariantResponse {
  id: number;
  productId: number;
  baseVariantId: number | null;
  type: string;
  value: string;
  isAvailable: boolean;
  priceCharge: number;
  subVariants: {
    id: number;
    type: string;
    value: string;
    isAvailable: boolean;
    price: number;
  }[];
}
