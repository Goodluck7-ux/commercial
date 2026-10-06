import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { StoreRole } from '../generated/prisma/enums.js';

@Injectable()
export class StoreAccessService {
    constructor(private readonly prisma: PrismaService) { }

    async requireRole(userId: string, storeId: string, roles: StoreRole[]) {
        const membership = await this.prisma.storeMember.findUnique({
            where: { storeId_userId: { storeId, userId } },
            select: { role: true, store: { select: { id: true, status: true } } },
        });

        if (!membership) throw new NotFoundException('Store not found');
        if (!roles.includes(membership.role)) {
            throw new ForbiddenException('You do not have permission for this action');
        }
        return membership.store;
    }
}