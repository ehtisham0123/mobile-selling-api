import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { Role as PrismaRole } from '@prisma/client'; // Import the generated Prisma enum
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<PrismaRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true; // No roles required, allow access
        }
        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw new ForbiddenException('User not found');
        }

        const userRecord = await this.prisma.user.findUnique({
            where: { id: user.id },
        });

        if (!userRecord) {
            throw new ForbiddenException('User not found');
        }

        // Check if user's role matches any of the required roles
        if (requiredRoles.includes(userRecord.role)) {
            return true;
        }

        throw new ForbiddenException('You do not have permission to access this resource');
    }
}
