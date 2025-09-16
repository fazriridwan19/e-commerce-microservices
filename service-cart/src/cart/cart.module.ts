import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartItemRepository } from 'src/repositories/cart-item.repository';

@Module({
  controllers: [CartController],
  providers: [CartService, CartItemRepository],
})
export class CartModule {}
