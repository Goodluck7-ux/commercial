import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { StoreAccessService } from '../stores/store-access.service.js';
import { slugify } from '../common/slug.js';
import { ProductStatus, StoreRole, StoreStatus } from '../generated/prisma/enums.js';
import type {
    CreateProductInput,
    UpdateProductInput,
    UpdateVariantInput,
} from './catalog.schemas.js';

const variantSelect = {
    id: true,
    name: true,
    sku: true,
    priceKobo: true,
    stock: true,
};

const productSelect = {
    id: true,
    name: true,
    slug: true,
    description: true,
    category: true,
    status: true,
    createdAt: true,
    variants: { select: variantSelect, orderBy: { createdAt: 'asc' as const } },
};

const CAN_EDIT = [StoreRole.OWNER, StoreRole.MANAGER];
const CAN_VIEW = [StoreRole.OWNER, StoreRole.MANAGER, StoreRole.STAFF];

@Injectable()
export class CatalogService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly access: StoreAccessService,
    ) { }

    private async uniqueSlug(storeId: string, name: string) {
        const base = slugify(name) || 'product';
        let slug = base;
        while (
            await this.prisma.product.findUnique({
                where: { storeId_slug: { storeId, slug } },
            })
        ) {
            slug = `${base}-${randomBytes(2).toString('hex')}`;
        }
        return slug;
    }

    async create(userId: string, storeId: string, input: CreateProductInput) {
        const store = await this.access.requireRole(userId, storeId, CAN_EDIT);
        if (store.status !== StoreStatus.ACTIVE) {
            throw new ForbiddenException('Your store must be approved before you can add products');
        }

        const slug = await this.uniqueSlug(storeId, input.name);
        return this.prisma.product.create({
            data: {
                storeId,
                name: input.name,
                slug,
                description: input.description,
                category: input.category,
                variants: { create: input.variants },
            },
            select: productSelect,
        });
    }

    async listForStore(userId: string, storeId: string) {
        await this.access.requireRole(userId, storeId, CAN_VIEW);
        return this.prisma.product.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' },
            select: productSelect,
        });
    }

    async updateProduct(
        userId: string,
        storeId: string,
        productId: string,
        input: UpdateProductInput,
    ) {
        const store = await this.access.requireRole(userId, storeId, CAN_EDIT);

        const product = await this.prisma.product.findFirst({
            where: { id: productId, storeId },
            select: { id: true },
        });
        if (!product) throw new NotFoundException('Product not found');

        if (input.status === ProductStatus.ACTIVE && store.status !== StoreStatus.ACTIVE) {
            throw new ForbiddenException('Your store must be active to publish products');
        }

        return this.prisma.product.update({
            where: { id: productId },
            data: input,
            select: productSelect,
        });
    }

    async updateVariant(
        userId: string,
        storeId: string,
        variantId: string,
        input: UpdateVariantInput,
    ) {
        await this.access.requireRole(userId, storeId, CAN_EDIT);

        const variant = await this.prisma.variant.findFirst({
            where: { id: variantId, product: { storeId } },
            select: { id: true },
        });
        if (!variant) throw new NotFoundException('Variant not found');

        return this.prisma.variant.update({
            where: { id: variantId },
            data: input,
            select: variantSelect,
        });
    }
}