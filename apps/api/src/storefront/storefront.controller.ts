import { Controller, Get, Param, Query } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { parse } from '../common/parse.js';
import { StorefrontService } from './storefront.service.js';
import { listProductsSchema } from './storefront.schemas.js';

@AllowAnonymous()
@Controller()
export class StorefrontController {
    constructor(private readonly storefront: StorefrontService) { }

    @Get('products')
    list(@Query() query: unknown) {
        return this.storefront.list(parse(listProductsSchema, query));
    }

    @Get('products/:id')
    findOne(@Param('id') id: string) {
        return this.storefront.findOne(id);
    }

    @Get('shops/:slug')
    findShop(@Param('slug') slug: string) {
        return this.storefront.findShop(slug);
    }
}