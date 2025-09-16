import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
import { DatabaseModule } from './modules/database.module';
import { LoggingModule } from './modules/logging.module';
import { ProductMediaRepository } from './repositories/product-media.repository';
import { ProductVariantRepository } from './repositories/product-variant.repository';
import { ProductRepository } from './repositories/product.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env` }),
    DatabaseModule,
    LoggingModule,
    CartModule,
    // RedisModule,
  ],
  controllers: [],
  providers: [ProductRepository, ProductMediaRepository, ProductVariantRepository],
})
export class AppModule {}
