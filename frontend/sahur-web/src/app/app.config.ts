import { LogoutUseCase } from './domain/use-cases/auth/logout.use-case';
import { GetSessionUseCase } from './domain/use-cases/auth/get-session.use-case';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import { routes } from './app.routes';
import { backendCredentialsInterceptor } from './core/http/backend-credentials.interceptor';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository';
import { HttpProductRepository } from './data/repositories/http-product.repository';
import { AuthRepository } from './domain/repositories/auth.repository';
import { HttpAuthRepository } from './data/repositories/http-auth.repository';
import { NetworkStatus } from './domain/services/network-status';
import { BrowserNetworkStatus } from './data/services/browser-network-status';
import { LoginUseCase } from './domain/use-cases/auth/login.use-case';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: GetSessionUseCase,
      useFactory: (repository: AuthRepository, network: NetworkStatus) =>
        new GetSessionUseCase(repository, network),
      deps: [AuthRepository, NetworkStatus]
    },
    {
      provide: LogoutUseCase,
      useFactory: (repository: AuthRepository, network: NetworkStatus) =>
        new LogoutUseCase(repository, network),
      deps: [AuthRepository, NetworkStatus]
    },
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([backendCredentialsInterceptor])
    ),
    {
      provide: PRODUCT_REPOSITORY,
      useClass: HttpProductRepository
    },
    {
      provide: AuthRepository,
      useClass: HttpAuthRepository
    },
    {
      provide: NetworkStatus,
      useClass: BrowserNetworkStatus
    },
    {
      provide: LoginUseCase,
      useFactory: (
        repository: AuthRepository,
        network: NetworkStatus
      ) => new LoginUseCase(repository, network),
      deps: [AuthRepository, NetworkStatus]
    }
  ]
};
