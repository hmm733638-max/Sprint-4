import { InjectionToken } from '@angular/core';

export interface ConnectivityRepository {
  isOnline(): boolean;
}

export const CONNECTIVITY_REPOSITORY = new InjectionToken<ConnectivityRepository>('ConnectivityRepository');
