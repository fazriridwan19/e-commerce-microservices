import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { mapError } from 'src/app/etc/utils';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/requests/create-product.dto';
import { UpdateProductDto } from './dto/requests/update-product.dto';
import { ProductService } from './services/product.service';
import { CurrentUser } from 'src/app/decorators/current-user.decorator';
import { ProductVariantService } from './services/product-variant.service';
import { CreateProductVariantRequest } from './dto/requests/create-product-variant-request.dto';

@Controller('product')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(
    private readonly productService: ProductService,
    private readonly variantService: ProductVariantService,
  ) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser('roles') roles: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    if (!roles?.includes('ADMIN')) {
      this.logger.warn(`Unauthorized access attempt to create product`);
      throw new ForbiddenException(
        'You do not have permission to create a product',
      );
    }

    this.logger.log(`[POST] /product/create - sku: ${createProductDto.sku}`);
    try {
      return await this.productService.create(createProductDto);
    } catch (error) {
      mapError(error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    this.logger.log(`[GET] /product`);
    try {
      return await this.productService.findAll();
    } catch (error) {
      mapError(error);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    this.logger.log(`[GET] /product/${id}`);
    try {
      return await this.productService.findOne(+id);
    } catch (error) {
      mapError(error);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser('roles') roles: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    if (!roles?.includes('ADMIN')) {
      this.logger.warn(`Unauthorized access attempt to create product`);
      throw new ForbiddenException(
        'You do not have permission to create a product',
      );
    }

    this.logger.log(`[PUT] /product/${updateProductDto.id}`);
    try {
      return await this.productService.update(updateProductDto);
    } catch (error) {
      mapError(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    this.logger.log(`[DELETE] /product/${id}`);
    try {
      return await this.productService.remove(+id);
    } catch (error) {
      mapError(error);
    }
  }

  @Post('variant')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createVariant(@Body() request: CreateProductVariantRequest) {
    this.logger.log(
      `[POST] /product/variant - productId: ${request.productId}, type: ${request.type}`,
    );
    try {
      return await this.variantService.createVariant(request);
    } catch (error) {
      mapError(error);
    }
  }
}
