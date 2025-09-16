import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { KafkaModule } from 'src/modules/kafka.module';
import { ProductRepository } from 'src/repositories/product.repository';
import { ProductVariantRepository } from 'src/repositories/product-variant.repository';

@Module({
  imports: [KafkaModule],
  controllers: [CartController],
  providers: [CartService, ProductRepository, ProductVariantRepository],
})
export class CartModule {}
