import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './product.controller';
import { KafkaModule } from 'src/modules/kafka.module';
import { ProductRepository } from 'src/repositories/product.repository';
import { ProductVariantRepository } from 'src/repositories/product-variant.repository';
import { ProductVariantService } from './services/product-variant.service';

@Module({
  imports: [KafkaModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, ProductVariantRepository, ProductVariantService],
})
export class ProductModule {}
