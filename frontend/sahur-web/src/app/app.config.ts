import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HttpSystemStatusDataSource } from './data/datasources/http-system-status.datasource';
import { SystemStatusDataSource } from './data/datasources/system-status.datasource';
import { HttpSystemStatusRepository } from './data/repositories/http-system-status.repository';
import { SYSTEM_STATUS_REPOSITORY } from './domain/repositories/system-status.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
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
