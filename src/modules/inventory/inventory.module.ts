import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryMovement } from './entities/inventory-movement.entoty';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, InventoryMovement]),
        OrganizationsModule,
    ],
    controllers: [InventoryController],
    providers: [InventoryService],
    exports: [TypeOrmModule],
})
export class InventoryModule { }
