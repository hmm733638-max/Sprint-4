import { Injectable } from '@angular/core';
import { ConnectivityRepository } from '../../domain/repositories/connectivity.repository';

@Injectable()
export class BrowserConnectivityRepository implements ConnectivityRepository {
  isOnline(): boolean { return navigator.onLine; }
}
