import { Injectable } from "@nestjs/common";
import { ProductVariant } from "src/entities/product-variant.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class ProductVariantRepository extends Repository<ProductVariant> {
  constructor(datasource: DataSource) {
    super(ProductVariant, datasource.createEntityManager());
  }
}