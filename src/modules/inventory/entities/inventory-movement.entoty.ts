import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./product.entity";

export enum MovementType {
    IN = 'IN',
    OUT = 'OUT'
}

@Entity('inventory_movements')
export class InventoryMovement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: MovementType })
    type: MovementType;

    @Column({ type: 'int' })
    quantity: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ name: 'product_id' })
    productId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}


