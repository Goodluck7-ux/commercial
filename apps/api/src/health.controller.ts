import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';

@Controller('health')
export class HealthController {
    constructor(private readonly prisma: PrismaService) { }

    @Get()
    async check() {
        let database: 'up' | 'down' = 'up';
        try {
            await (this.prisma as any).$queryRaw`SELECT 1`;
        } catch {
            database = 'down';
        }

        return {
            status: database === 'up' ? 'ok' : 'degraded',
            service: 'api',
            database,
            timestamp: new Date().toISOString(),
        };
    }
}