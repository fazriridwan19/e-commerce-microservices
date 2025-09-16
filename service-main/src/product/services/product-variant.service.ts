import {
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ProductVariantRepository } from 'src/repositories/product-variant.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { CreateProductVariantRequest } from '../dto/requests/create-product-variant-request.dto';
import { ProductVariantResponse } from '../dto/responses/product-variant-response.dto';

@Injectable()
export class ProductVariantService {
  private readonly logger = new Logger(ProductVariantService.name);

  constructor(
    private readonly productVariantRepo: ProductVariantRepository,
    private readonly productRepo: ProductRepository,
  ) {}

  async createVariant(
    request: CreateProductVariantRequest,
  ): Promise<ProductVariantResponse> {
    if (request.variantId) {
      const variant = await this.productVariantRepo.findOne({
        where: { id: request.variantId },
      });
      if (!variant) {
        this.logger.error(`Variant with ID: ${request.variantId} not found`);
        throw new NotFoundException('Variant not found');
      }
      if (request.type.toLowerCase() === variant.type?.toLowerCase()) {
        this.logger.error(`Variant type: ${request.type} already exists`);
        throw new NotAcceptableException('Variant type already exists');
      }
    }
    const product = await this.productRepo.findOne({
      where: { id: request.productId },
    });
    if (!product) {
      this.logger.error(`Product with ID: ${request.productId} not found`);
      throw new NotFoundException('Product not found');
    }
    const variant = this.productVariantRepo.create(request);
    await this.productVariantRepo.save(variant);
    this.logger.log(
      `Variant created for Product ID: ${request.productId} with type: ${request.type}`,
    );

    return {
      id: variant.id,
      productId: product.id,
      baseVariantId: variant.baseVariantId,
      type: variant.type as string,
      value: variant.value as string,
      isAvailable: variant.isAvailable,
      priceCharge: variant.priceCharge as number,
      subVariants: [],
    };
  }
}
