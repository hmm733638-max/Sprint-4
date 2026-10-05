import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { AuthDataSource } from './data/datasources/auth.datasource';
import { CartDataSource } from './data/datasources/cart.datasource';
import { HttpAuthDataSource } from './data/datasources/http-auth.datasource';
import { HttpCartDataSource } from './data/datasources/http-cart.datasource';
import { HttpProductDataSource } from './data/datasources/http-product.datasource';
import { HttpSystemStatusDataSource } from './data/datasources/http-system-status.datasource';
import { ProductDataSource } from './data/datasources/product.datasource';
import { SystemStatusDataSource } from './data/datasources/system-status.datasource';

import { BrowserCartRepository } from './data/repositories/browser-cart.repository';
import { BrowserConnectivityRepository } from './data/repositories/browser-connectivity.repository';
import { BrowserSessionRepository } from './data/repositories/browser-session.repository';
import { HttpAuthRepository } from './data/repositories/http-auth.repository';
import { HttpCartRepository } from './data/repositories/http-cart.repository';
import { HttpProductRepository } from './data/repositories/http-product.repository';
import { HttpSystemStatusRepository } from './data/repositories/http-system-status.repository';

import { AUTH_REPOSITORY } from './domain/repositories/auth.repository';
import { CART_REPOSITORY } from './domain/repositories/cart.repository';
import { CONNECTIVITY_REPOSITORY } from './domain/repositories/connectivity.repository';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository';
import { SESSION_REPOSITORY } from './domain/repositories/session.repository';
import { SYSTEM_STATUS_REPOSITORY } from './domain/repositories/system-status.repository';

import { AddToCartUseCase } from './domain/use-cases/cart/add-to-cart.use-case';
import { RemoveFromCartUseCase } from './domain/use-cases/cart/remove-from-cart.use-case';
import { UpdateCartUseCase } from './domain/use-cases/cart/update-cart.use-case';
import { LogoutUseCase } from './domain/use-cases/auth/logout.use-case';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),

    LogoutUseCase,
    AddToCartUseCase,
    UpdateCartUseCase,
    RemoveFromCartUseCase,

    { provide: AuthDataSource, useClass: HttpAuthDataSource },
    { provide: AUTH_REPOSITORY, useClass: HttpAuthRepository },

    { provide: SESSION_REPOSITORY, useClass: BrowserSessionRepository },

    { provide: CONNECTIVITY_REPOSITORY, useClass: BrowserConnectivityRepository },

    { provide: CartDataSource, useClass: HttpCartDataSource },
    { provide: BrowserCartRepository, useClass: BrowserCartRepository },
    { provide: CART_REPOSITORY, useClass: HttpCartRepository },

    { provide: ProductDataSource, useClass: HttpProductDataSource },
    { provide: PRODUCT_REPOSITORY, useClass: HttpProductRepository },

    { provide: SystemStatusDataSource, useClass: HttpSystemStatusDataSource },
    { provide: SYSTEM_STATUS_REPOSITORY, useClass: HttpSystemStatusRepository }
  ]
};