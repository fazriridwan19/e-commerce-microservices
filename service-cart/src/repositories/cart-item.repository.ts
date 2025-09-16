import { Injectable } from '@nestjs/common';
import { CartItem } from 'src/entities/cart-item.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CartItemRepository extends Repository<CartItem> {
  constructor(datasource: DataSource) {
    super(CartItem, datasource.createEntityManager());
  }
}
