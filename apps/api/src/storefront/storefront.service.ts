import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProductStatus, StoreStatus } from '../generated/prisma/enums.js';
import type { Prisma } from '../generated/prisma/client.js';
import type { ListProductsQuery } from './storefront.schemas.js';

const publicStore = { select: { name: true, slug: true, logoUrl: true } };

@Injectable()
export class StorefrontService {
    constructor(private readonly prisma: PrismaService) { }

    async list(query: ListProductsQuery) {
        const where: Prisma.ProductWhereInput = {
            status: ProductStatus.ACTIVE,
            store: {
                status: StoreStatus.ACTIVE,
                ...(query.store ? { slug: query.store } : {}),
            },
            variants: { some: {} },
            ...(query.category ? { category: query.category } : {}),
            ...(query.q
                ? {
                    OR: [
                        { name: { contains: query.q, mode: 'insensitive' } },
                        { description: { contains: query.q, mode: 'insensitive' } },
                    ],
                }
                : {}),
        };

        const [total, rows] = await Promise.all([
            this.prisma.product.count({ where }),
            this.prisma.product.findMany({
                where,
                orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    category: true,
                    store: publicStore,
                    variants: { select: { priceKobo: true, stock: true } },
                },
            }),
        ]);

        return {
            items: rows.map((p) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                category: p.category,
                store: p.store,
                fromPriceKobo: Math.min(...p.variants.map((v) => v.priceKobo)),
                inStock: p.variants.some((v) => v.stock > 0),
            })),
            page: query.page,
            limit: query.limit,
            total,
            totalPages: Math.max(1, Math.ceil(total / query.limit)),
        };
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findFirst({
            where: {
                id,
                status: ProductStatus.ACTIVE,
                store: { status: StoreStatus.ACTIVE },
            },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                category: true,
                createdAt: true,
                store: publicStore,
                variants: {
                    orderBy: { createdAt: 'asc' },
                    select: { id: true, name: true, priceKobo: true, stock: true },
                },
            },
        });
        if (!product) throw new NotFoundException('Product not found');

        return {
            ...product,
            variants: product.variants.map(({ stock, ...v }) => ({
                ...v,
                available: Math.min(stock, 10),
            })),
        };
    }

    async findShop(slug: string) {
        const store = await this.prisma.store.findFirst({
            where: { slug, status: StoreStatus.ACTIVE },
            select: {
                name: true,
                slug: true,
                description: true,
                logoUrl: true,
                _count: {
                    select: { products: { where: { status: ProductStatus.ACTIVE } } },
                },
            },
        });
        if (!store) throw new NotFoundException('Store not found');

        const { _count, ...rest } = store;
        return { ...rest, productCount: _count.products };
    }
}