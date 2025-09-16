import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { Product } from 'src/entities/product.entity';
import { ProductVariant } from 'src/entities/product-variant.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: configService.get<number>('MYSQL_PORT'),
        username: configService.get<string>('MYSQL_USERNAME'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE'),
        entities: [User, Product, ProductVariant],
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        dateStrings: true,
        synchronize: configService.get<boolean>('MYSQL_SYNCHRONIZE') ?? false,
      }),
    }),
  ],
  exports: [TypeOrmModule],
  providers: [UserRepository],
})
export class DatabaseModule {}
