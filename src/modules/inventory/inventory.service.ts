import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { InventoryMovement, MovementType } from './entities/inventory-movement.entoty';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateMovementDto } from './dto/create-movement.dto';
import { Organization } from '../organizations/entities/organization.entity';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(InventoryMovement)
        private readonly movementRepository: Repository<InventoryMovement>,
        private readonly dataSource: DataSource,
    ) { }

    async create(createProductDto: CreateProductDto, organization: Organization) {
        const product = this.productRepository.create({
            ...createProductDto,
            organization: organization,
        });

        return await this.productRepository.save(product);
    }

    async findAll(organization: Organization) {
        return await this.productRepository.find({
            where: {
                organization: { id: organization.id }
            },
        });
    }

    async registerMovement(createMovementDto: CreateMovementDto) {
        const { productId, type, quantity, reason } = createMovementDto;

        return await this.dataSource.transaction(async (manager) => {
            const product = await manager.findOne(Product, { where: { id: productId } });

            if (!product) {
                throw new NotFoundException('Producto no encontrado');
            }

            let newStock = 0;

            if (type === MovementType.IN) {
                newStock = product.stock + quantity;
            } else {
                if (product.stock < quantity) {
                    throw new BadRequestException(`Stock insuficiente.Tienes ${product.stock} e intentas sacar ${quantity}`);
                }
                newStock = product.stock - quantity;
            }

            const movement = manager.create(InventoryMovement, {
                type,
                quantity,
                reason,
                productId,
            });
            await manager.save(movement);

            product.stock = newStock;
            await manager.save(product);

            let alertMessage: string | null = null;
            const isLowStock = newStock <= product.minStock;

            if (isLowStock && type === MovementType.OUT) {
                alertMessage = `⚠️ ALERTA: El stock está bajo (${newStock} unidades). Reabastecer pronto.`;
            }

            return {
                movement,
                currentStock: newStock,
                isLowStock: isLowStock,
                alert: alertMessage,
            }
        })
    }

    async getHistory(productId: string) {
        return await this.movementRepository.find({
            where: { product: { id: productId } },
            order: { createdAt: 'DESC' }
        });
    }

}
