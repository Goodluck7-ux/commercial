import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { z } from 'zod';
import { StoresService } from './stores.service.js';

const createStoreSchema = z.object({
    name: z.string().trim().min(3).max(60),
    description: z.string().trim().max(500).optional(),
});

const statusQuerySchema = z.enum(['PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED']);
const updateStatusSchema = z.object({
    status: z.enum(['ACTIVE', 'REJECTED', 'SUSPENDED']),
});

function parse<T>(schema: z.ZodType<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new BadRequestException({
            message: 'Invalid input',
            issues: result.error.issues.map((i) => ({
                path: i.path.join('.'),
                message: i.message,
            })),
        });
    }
    return result.data;
}

function assertAdmin(session: UserSession) {
    const role = (session.user as { role?: string }).role;
    if (role !== 'admin') throw new ForbiddenException('Admin only');
}

@Controller()
export class StoresController {
    constructor(private readonly stores: StoresService) { }

    @Post('stores')
    create(@Session() session: UserSession, @Body() body: unknown) {
        const input = parse(createStoreSchema, body);
        return this.stores.create(session.user.id, input);
    }

    @Get('stores/me')
    mine(@Session() session: UserSession) {
        return this.stores.findMine(session.user.id);
    }

    @Get('admin/stores')
    listForAdmin(@Session() session: UserSession, @Query('status') status?: string) {
        assertAdmin(session);
        return this.stores.listByStatus(parse(statusQuerySchema, status ?? 'PENDING'));
    }

    @Patch('admin/stores/:id/status')
    setStatus(
        @Session() session: UserSession,
        @Param('id') id: string,
        @Body() body: unknown,
    ) {
        assertAdmin(session);
        const { status } = parse(updateStatusSchema, body);
        return this.stores.setStatus(id, status);
    }
}