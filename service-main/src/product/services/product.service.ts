import {
  Inject,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ProductRepository } from 'src/repositories/product.repository';
import { CreateProductDto } from '../dto/requests/create-product.dto';
import { UpdateProductDto } from '../dto/requests/update-product.dto';
import { ProductResponseDto } from '../dto/responses/product-response.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly productRepository: ProductRepository,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = this.productRepository.create(createProductDto);

    const isProductExist = await this.productRepository.exists({
      where: { sku: createProductDto.sku },
    });

    if (isProductExist) {
      this.logger.error(
        `Product with SKU: ${createProductDto.sku} already exists`,
      );
      throw new NotAcceptableException('Product with this SKU already exists');
    }

    const { id } = await this.productRepository.save(product);
    this.logger.log(`Product created with SKU: ${createProductDto.sku}`);

    return {
      id,
      ...createProductDto,
      totalPriceCharge: 0,
      variants: [],
    };
  }

  async findAll(): Promise<ProductResponseDto[]> {
    const products = (
      await this.productRepository.find({ relations: { variants: true } })
    ).map(
      (product): ProductResponseDto => ({
        id: product.id,
        sku: product.sku as string,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        totalPriceCharge: product.totalVariantCharge,
        variants: [],
      }),
    );
    return products;
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { variants: true },
    });

    if (!product) {
      this.logger.error(`Product with ID: ${id} not found`);
      throw new NotFoundException('Product not found');
    }

    return {
      id: product.id,
      sku: product.sku as string,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      totalPriceCharge: product.totalVariantCharge,
      variants:
        product.variants?.map((variant) => ({
          id: variant.id,
          productId: variant.productId as number,
          baseVariantId: variant.baseVariantId,
          type: variant.type as string,
          value: variant.value as string,
          priceCharge: variant.priceCharge as number,
          isAvailable: variant.isAvailable,
          subVariants: [],
        })) ?? [],
    };
  }

  async update(
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id: updateProductDto.id },
      relations: { variants: true },
    });

    if (!product) {
      this.logger.error(`Product with ID: ${updateProductDto.id} not found`);
      throw new NotFoundException('Product not found');
    }

    if (product.sku !== updateProductDto.sku) {
      const isSkuExist = await this.productRepository.exists({
        where: { sku: updateProductDto.sku },
      });

      if (isSkuExist) {
        this.logger.error(
          `Product with SKU: ${updateProductDto.sku} already exists`,
        );
        throw new NotAcceptableException(
          'Product with this SKU already exists',
        );
      }
    }

    product.sku = updateProductDto.sku;
    product.name = updateProductDto.name;
    product.description = updateProductDto.description;
    product.price = updateProductDto.price;
    product.category = updateProductDto.category;
    await this.productRepository.save(product);

    this.logger.log(`Product with ID: ${updateProductDto.id} updated`);

    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      totalPriceCharge: product.totalVariantCharge,
      variants: [],
    };
  }

  async remove(id: number): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      this.logger.error(`Product with ID: ${id} not found`);
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.delete({ id });

    return {
      id: product.id,
      sku: product.sku as string,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      totalPriceCharge: product.totalVariantCharge,
      variants: [],
    };
  }
}
