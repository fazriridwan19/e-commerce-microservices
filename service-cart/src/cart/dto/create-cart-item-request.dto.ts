export class CreateCartItemRequest {
  userId: number;
  productId: number;
  variantId: number | null;
  productName: string;
  productPrice: number;
  quantity: number;
  status: string;
}
