import { IsString, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateOrganizationDto {
    @ApiProperty({example: 'Nintendo', description:'Nombre de la empresa'})
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;
}