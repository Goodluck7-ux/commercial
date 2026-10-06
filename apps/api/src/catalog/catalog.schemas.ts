import { z } from 'zod';

const variantFields = {
    name: z.string().trim().min(1).max(60),
    sku: z.string().trim().max(40).optional(),
    priceKobo: z.number().int().min(100).max(100_000_000),
    stock: z.number().int().min(0).max(100_000),
};

const productFields = {
    name: z.string().trim().min(3).max(80),
    description: z.string().trim().max(2000).optional(),
    category: z.enum(['FASHION', 'BEAUTY', 'HOME', 'ELECTRONICS', 'FOOD', 'OTHER']),
    status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
};

const notEmpty = (v: object) => Object.keys(v).length > 0;

export const createProductSchema = z.object({
    name: productFields.name,
    description: productFields.description,
    category: productFields.category.default('OTHER'),
    variants: z
        .array(z.object({ ...variantFields, name: variantFields.name.default('Default') }))
        .min(1)
        .max(20),
});

export const updateProductSchema = z
    .object(productFields)
    .partial()
    .refine(notEmpty, { message: 'Nothing to update' });

export const updateVariantSchema = z
    .object(variantFields)
    .partial()
    .refine(notEmpty, { message: 'Nothing to update' });

export type CreateProductInput = z.output<typeof createProductSchema>;
export type UpdateProductInput = z.output<typeof updateProductSchema>;
export type UpdateVariantInput = z.output<typeof updateVariantSchema>;