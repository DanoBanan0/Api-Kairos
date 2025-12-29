import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateMovementDto } from './dto/create-movement.dto';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from './guards/api-key.guard';
import { request } from 'http';

@ApiTags('Inventory')
@ApiSecurity('x-api-key')
@UseGuards(ApiKeyGuard)
@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post('products')
    @ApiOperation({ summary: 'Create a new product' })
    create(@Body() createProductDto: CreateProductDto, @Req() request: any) {
        const organization = request.organization;
        return this.inventoryService.create(createProductDto, organization);
    }

    @Get('products')
    @ApiOperation({ summary: 'Get all products' })
    findAll(@Req() request: any) {
        const organization = request.organization;
        return this.inventoryService.findAll(organization);
    }

    @Post('movements')
    @ApiOperation({ summary: 'Register an inventory movement' })
    registerMovement(@Body() createMovementDto: CreateMovementDto) {
        return this.inventoryService.registerMovement(createMovementDto);
    }

    @Get('history/:productId')
    @ApiOperation({ summary: 'Get inventory movement history for a product' })
    getHistory(@Param('productId') productId: string) {
        return this.inventoryService.getHistory(productId);
    }
}
