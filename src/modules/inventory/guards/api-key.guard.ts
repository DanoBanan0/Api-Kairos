import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(
        @InjectRepository(Organization)
        private readonly orgRepository: Repository<Organization>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const apiKey = request.headers['x-api-key'];

        if (!apiKey) {
            throw new UnauthorizedException('API Key es necesaria (x-api-key)');
        }

        const organization = await this.orgRepository.findOne({ where: { apiKey } });

        if (!organization) {
            throw new UnauthorizedException('API Key inválida');
        }

        request['organization'] = organization;

        return true;
    }
}