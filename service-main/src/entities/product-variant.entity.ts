import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'master_product_variants', synchronize: false })
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id', type: 'int', nullable: false })
  productId: number | null;

  @Column({ name: 'variant_id', type: 'int', nullable: true })
  baseVariantId: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type: string | null;

  @Column({ type: 'varchar', length: 60, nullable: true })
  value: string | null;

  @Column({ name: 'is_available', type: 'bool', nullable: true })
  isAvailable: boolean;

  @Column({ name: 'price_charge', type: 'int', nullable: true })
  priceCharge: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date | null;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product

  @OneToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id', referencedColumnName: 'id' })
  baseVariant: ProductVariant
}
