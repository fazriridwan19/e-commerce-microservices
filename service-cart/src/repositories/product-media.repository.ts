import { Injectable } from "@nestjs/common";
import { ProductMedia } from "src/entities/product-media.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class ProductMediaRepository extends Repository<ProductMedia> {
  constructor(datasource: DataSource) {
    super(ProductMedia, datasource.createEntityManager());
  }
}