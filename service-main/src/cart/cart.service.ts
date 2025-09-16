import {
  Inject,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ProductVariantRepository } from 'src/repositories/product-variant.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { CreateCartItemRequest } from './dto/create-cart-item-request.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly productRepo: ProductRepository,
    private readonly productVariantRepo: ProductVariantRepository,
  ) {}

  async create(req: CreateCartItemRequest, userId: number) {
    const product = await this.productRepo.findOne({
      where: { id: req.productId },
    });

    if (!product) {
      this.logger.error(`Product ID: ${req.productId} not exists`);
      throw new NotFoundException('Product with this ID not exists');
    }

    if (product.stock && req.quantity > product.stock) {
      this.logger.error(`Quantity has exceed stock of the product`);
      throw new NotAcceptableException(
        'Quantity has exceed stock of the product',
      );
    }

    if (req.variantId) {
      const isExists = await this.productVariantRepo.exists({
        where: {
          id: req.variantId,
        },
        select: {
          id: true,
        },
      });

      if (!isExists) {
        this.logger.error(
          `Product variants not found for IDs: ${req.variantId}`,
        );
        throw new NotFoundException(
          `Product variants not found for IDs: ${req.variantId}`,
        );
      }
    }

    this.kafkaClient.emit('cart-created', {
      userId,
      productId: product.id,
      variantId: req.variantId,
      productName: product.name,
      productPrice: product.price,
      quantity: req.quantity,
      status: 'CREATED',
    });

    return {
      productId: product.id,
      sku: product.sku,
      productName: product.name,
    };
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
