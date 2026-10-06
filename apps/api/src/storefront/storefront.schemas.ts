import { z } from 'zod';

export const listProductsSchema = z.object({
    category: z.enum(['FASHION', 'BEAUTY', 'HOME', 'ELECTRONICS', 'FOOD', 'OTHER']).optional(),
    q: z
        .string()
        .trim()
        .max(60)
        .optional()
        .transform((v) => v || undefined),
    store: z.string().trim().max(60).optional(),
    page: z.coerce.number().int().min(1).max(1000).default(1),
    limit: z.coerce.number().int().min(1).max(48).default(12),
});

export type ListProductsQuery = z.output<typeof listProductsSchema>;