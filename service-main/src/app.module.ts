import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './modules/database.module';
import { LoggingModule } from './modules/logging.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env` }),
    DatabaseModule,
    LoggingModule,
    // RedisModule,
    AuthModule,
    UserModule,
    ProductModule,
    CartModule,
    // RestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
