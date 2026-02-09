import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { RolesEnum } from "src/enum/role.enum";


@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<RolesEnum[]>('roles', context.getHandler)
        if(!roles) return true;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return roles.some((role) => user?.roles?.includes(role));
    }
}