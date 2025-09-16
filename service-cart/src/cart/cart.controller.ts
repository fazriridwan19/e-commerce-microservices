import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartService } from './cart.service';
import { CreateCartItemRequest } from './dto/create-cart-item-request.dto';
import { UpdateCartItemRequest } from './dto/update-cart-item-request.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern('cart-created')
  async create(@Payload() req: CreateCartItemRequest) {
    return this.cartService.create(req);
  }

  @MessagePattern('findAllCart')
  findAll() {
    return this.cartService.findAll();
  }

  @MessagePattern('findOneCart')
  findOne(@Payload() id: number) {
    return this.cartService.findOne(id);
  }

  @MessagePattern('updateCart')
  update(@Payload() req: UpdateCartItemRequest) {
    return this.cartService.update(req);
  }

  @MessagePattern('removeCart')
  remove(@Payload() id: number) {
    return this.cartService.remove(id);
  }
}
