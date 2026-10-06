import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { parse } from '../common/parse.js';
import { CatalogService } from './catalog.service.js';
import {
    createProductSchema,
    updateProductSchema,
    updateVariantSchema,
} from './catalog.schemas.js';

@Controller('stores/:storeId')
export class CatalogController {
    constructor(private readonly catalog: CatalogService) { }

    @Post('products')
    create(
        @Session() session: UserSession,
        @Param('storeId') storeId: string,
        @Body() body: unknown,
    ) {
        return this.catalog.create(session.user.id, storeId, parse(createProductSchema, body));
    }

    @Get('products')
    list(@Session() session: UserSession, @Param('storeId') storeId: string) {
        return this.catalog.listForStore(session.user.id, storeId);
    }

    @Patch('products/:productId')
    updateProduct(
        @Session() session: UserSession,
        @Param('storeId') storeId: string,
        @Param('productId') productId: string,
        @Body() body: unknown,
    ) {
        return this.catalog.updateProduct(
            session.user.id,
            storeId,
            productId,
            parse(updateProductSchema, body),
        );
    }

    @Patch('variants/:variantId')
    updateVariant(
        @Session() session: UserSession,
        @Param('storeId') storeId: string,
        @Param('variantId') variantId: string,
        @Body() body: unknown,
    ) {
        return this.catalog.updateVariant(
            session.user.id,
            storeId,
            variantId,
            parse(updateVariantSchema, body),
        );
    }
}