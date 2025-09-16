import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'trx_product_medias', synchronize: false })
export class ProductMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'variant_id', type: 'int', nullable: true })
  variantId: number | null;

  @Column({ name: 'feedback_id', type: 'int', nullable: true })
  feedbackId: number | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  path: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  filename: string | null;

  @Column({ type: 'varchar', length: 15, nullable: true })
  type: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date | null;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
