import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class RapidApiGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        
        if (request.url.includes('/docs') || request.url.includes('-json')) {
            return true;
        }

        const rapidSecret = request.headers['x-rapidapi-proxy-secret'];
        const mySecret = process.env.RAPIDAPI_SECRET;

        if (!mySecret) {
            console.error('ERROR: La variable RAPIDAPI_SECRET no está configurada.');
            return false;
        }

        if (rapidSecret === mySecret) {
            return true;
        } else {
            throw new UnauthorizedException('Acceso denegado. Usa RapidAPI.');
        }
    }
}