import { IsString, IsNotEmpty, IsOptional, IsObject, IsInt, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
    @ApiProperty({ example: 'Nike Air Force 1', description: 'Nombre del producto' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'NK-AF1-001', description: 'SKU único' })
    @IsString()
    @IsNotEmpty()
    sku: string;

    @ApiProperty({ example: 'Zapatillas clasicas blancas', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 10, description: 'Avisar cuando el stock baja de esta cantidad', required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    minStock?: number;

    @ApiProperty({ example: { size: 42, color: 'white' }, description: 'Datos flexibles (JSON)' })
    @IsOptional()
    @IsObject() 
    metadata?: any; 
}