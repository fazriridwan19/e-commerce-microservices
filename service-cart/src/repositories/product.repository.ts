import { Injectable } from "@nestjs/common";
import { Product } from "src/entities/product.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(datasource: DataSource) {
    super(Product, datasource.createEntityManager());
  }
}