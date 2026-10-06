import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller.js';
import { StoresService } from './stores.service.js';
import { StoreAccessService } from './store-access.service.js';

@Module({
    controllers: [StoresController],
    providers: [StoresService, StoreAccessService],
    exports: [StoreAccessService],
})
export class StoresModule { }