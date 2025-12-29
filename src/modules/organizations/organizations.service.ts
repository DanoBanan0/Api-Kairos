import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrganizationsService {
    constructor(
        @InjectRepository(Organization)
        private readonly orgRepository: Repository<Organization>,
    ) { }

    async create(createOrganizationDto: CreateOrganizationDto) {
        const slug = createOrganizationDto.name
            .toLowerCase()
            .trim()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');

        const existing = await this.orgRepository.findOne({ where: { slug } });
        if (existing) {
            throw new BadRequestException('Ya existe una organizacion con ese nombre similar');
        }

        const apiKey = `live_${uuidv4()}`;

        const org = this.orgRepository.create({
            name: createOrganizationDto.name,
            slug: slug,
            apiKey: apiKey,
        });

        return await this.orgRepository.save(org);
    }

    async resetApiKey(organizacionId: string) {
        const org = await this.orgRepository.findOne({ where: { id: organizacionId } });

        if (!org) {
            throw new BadRequestException('Organizacion no encontrada');
        }

        const newApiKey = `live_${uuidv4()}`;
        org.apiKey = newApiKey;

        return await this.orgRepository.save(org);
    }
}
