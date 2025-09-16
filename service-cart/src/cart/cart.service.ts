import { Injectable, Logger } from '@nestjs/common';
import { CreateCartItemRequest } from './dto/create-cart-item-request.dto';
import { UpdateCartItemRequest } from './dto/update-cart-item-request.dto';
import { CartItem } from 'src/entities/cart-item.entity';
import { CartItemRepository } from 'src/repositories/cart-item.repository';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(private readonly cartItemRepo: CartItemRepository) {}

  async create(req: CreateCartItemRequest) {
    const existingCartItem = await this.cartItemRepo.findOne({
      where: {
        userId: req.userId,
        productId: req.productId,
        variantId: req.variantId ?? undefined,
      },
    });

    if (existingCartItem) {
      existingCartItem.quantity =
        (existingCartItem.quantity ?? 0) + req.quantity;
      await this.cartItemRepo.save(existingCartItem);
      this.logger.log(
        `Poduct with ID: ${existingCartItem.productId} successfully added to cart`,
      );
      return;
    }

    const cartItem = new CartItem();
    cartItem.productId = req.productId;
    cartItem.userId = req.userId;
    cartItem.variantId = req.variantId;
    cartItem.productName = req.productName;
    cartItem.productPrice = req.productPrice;
    cartItem.quantity = req.quantity;
    cartItem.status = req.status;
    cartItem.notes = 'Cart created';

    await this.cartItemRepo.save(cartItem);

    this.logger.log(
      `New product with ID: ${cartItem.productId} successfully added to cart`,
    );
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(req: UpdateCartItemRequest) {
    return `This action updates a # cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
