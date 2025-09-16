import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'trx_cart_items', synchronize: false })
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int', nullable: false })
  userId: number;

  @Column({ name: 'product_id', type: 'int', nullable: false })
  productId: number | null;

  @Column({ name: 'variant_id', type: 'int', nullable: true })
  variantId: number | null;

  @Column({
    name: 'product_name',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  productName: string | null;

  @Column({ name: 'product_price', type: 'int', nullable: true })
  productPrice: number | null;

  @Column({ type: 'int', nullable: true })
  quantity: number | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  notes: string | null;

  @Column({ type: 'varchar', length: 15, nullable: true })
  status: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date | null;
}
