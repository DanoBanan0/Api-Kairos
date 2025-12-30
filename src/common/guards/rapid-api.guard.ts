import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class RapidApiGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const rapidSecret = request.headers['x-rapidapi-proxy-secret'];
        const mySecret = process.env.RAPIDAPI_SECRET;

        if (!mySecret) {
            console.error('ERROR: La variable RAPIDAPI_SECRET no está configurada en el servidor.');
            return false;
        }

        if (rapidSecret === mySecret) {
            return true;
        } else {
            throw new UnauthorizedException('Acceso denegado. Usa RapidAPI.');
        }
    }
}