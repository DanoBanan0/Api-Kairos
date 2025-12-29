import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MovementType } from "../entities/inventory-movement.entoty";

export class CreateMovementDto {
    @ApiProperty({ example: 'uuid-del-producto', description: 'ID del producto a mover' })
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ enum: MovementType, example: MovementType.IN, description: 'IN (Entrada) o OUT (Salida)' })
    @IsEnum(MovementType)
    @IsNotEmpty()
    type: MovementType;

    @ApiProperty({ example: 10, description: 'Cantidad (siempre positiva)' })
    @IsInt()
    @IsPositive()
    quantity: number;

    @ApiProperty({ example: 'Compra de lote #505', description: 'Razón del movimiento' })
    @IsString()
    @IsNotEmpty()
    reason: string;
}





