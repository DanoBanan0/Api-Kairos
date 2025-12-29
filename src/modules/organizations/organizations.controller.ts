import { Controller, Post, Body, Patch, Param, Headers, UnauthorizedException } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) { }

    @Post()
    @ApiOperation({ summary: 'Registrar una nueva organizacion y obtener API Key' })
    @ApiResponse({ status: 201, description: 'Organizacion creada. ¡Guarda tu API Key!' })
    async create(@Body() createOrganizationDto: CreateOrganizationDto) {
        return this.organizationsService.create(createOrganizationDto);
    }

    @Patch(':id/reset-api-key')
    @ApiOperation({ summary: 'ADMIN: Reset the API Key for an organization' })
    async resetApiKey(
        @Param('id') id: string,
        @Headers('x-admin-secret') adminsecret: string,
    ) {
        if (adminsecret !== process.env.ADMIN_SECRET) {
            throw new UnauthorizedException('Admin secret is invalid');
        }
        return this.organizationsService.resetApiKey(id);
    }
}
