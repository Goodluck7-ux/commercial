import { BadRequestException } from '@nestjs/common';
import type { z } from 'zod';

export function parse<S extends z.ZodType>(schema: S, data: unknown): z.output<S> {
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