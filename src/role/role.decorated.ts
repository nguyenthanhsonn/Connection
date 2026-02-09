import { SetMetadata } from "@nestjs/common";
import { RolesEnum } from "src/enum/role.enum";

export const Role = (...roles: RolesEnum[]) => SetMetadata('roles', roles);