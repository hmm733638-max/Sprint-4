import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HttpSystemStatusDataSource } from './data/datasources/http-system-status.datasource';
import { SystemStatusDataSource } from './data/datasources/system-status.datasource';
import { HttpSystemStatusRepository } from './data/repositories/http-system-status.repository';
import { SYSTEM_STATUS_REPOSITORY } from './domain/repositories/system-status.repository';
import { AuthDataSource } from './data/datasources/auth.datasource';
import { HttpAuthDataSource } from './data/datasources/http-auth.datasource';
import { HttpAuthRepository } from './data/repositories/http-auth.repository';
import { BrowserSessionRepository } from './data/repositories/browser-session.repository';
import { BrowserConnectivityRepository } from './data/repositories/browser-connectivity.repository';
import { AUTH_REPOSITORY } from './domain/repositories/auth.repository';
import { SESSION_REPOSITORY } from './domain/repositories/session.repository';
import { CONNECTIVITY_REPOSITORY } from './domain/repositories/connectivity.repository';
import { LogoutUseCase } from './domain/use-cases/auth/logout.use-case';
import { ProductDataSource } from './data/datasources/product.datasource';
import { HttpProductDataSource } from './data/datasources/http-product.datasource';
import { HttpProductRepository } from './data/repositories/http-product.repository';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository';
import { UserDirectoryDataSource } from './data/datasources/user-directory.datasource';
import { HttpUserDirectoryDataSource } from './data/datasources/http-user-directory.datasource';
import { HttpUserDirectoryRepository } from './data/repositories/http-user-directory.repository';
import { USER_DIRECTORY_REPOSITORY } from './domain/repositories/user-directory.repository';
import { CartDataSource } from './data/datasources/cart.datasource';
import { HttpCartDataSource } from './data/datasources/http-cart.datasource';
import { HttpCartRepository } from './data/repositories/http-cart.repository';
import { CART_REPOSITORY } from './domain/repositories/cart.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    LogoutUseCase,
    { provide: AuthDataSource, useClass: HttpAuthDataSource },
    { provide: AUTH_REPOSITORY, useClass: HttpAuthRepository },
    { provide: SESSION_REPOSITORY, useClass: BrowserSessionRepository },
    { provide: CONNECTIVITY_REPOSITORY, useClass: BrowserConnectivityRepository },
    { provide: ProductDataSource, useClass: HttpProductDataSource },
    { provide: PRODUCT_REPOSITORY, useClass: HttpProductRepository },
    { provide: UserDirectoryDataSource, useClass: HttpUserDirectoryDataSource },
    { provide: USER_DIRECTORY_REPOSITORY, useClass: HttpUserDirectoryRepository },
    { provide: CartDataSource, useClass: HttpCartDataSource },
    { provide: CART_REPOSITORY, useClass: HttpCartRepository },
    {
      provide: SystemStatusDataSource,
      useClass: HttpSystemStatusDataSource
    },
    {
      provide: SYSTEM_STATUS_REPOSITORY,
      useClass: HttpSystemStatusRepository
    }
  ]
};
