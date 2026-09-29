import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository';
import { HttpProductRepository } from './data/repositories/http-product.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    { provide: PRODUCT_REPOSITORY, useClass: HttpProductRepository }
  ]
};
