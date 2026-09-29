import { Injectable } from '@angular/core';
import { NetworkStatus } from '../../domain/services/network-status';

@Injectable()
export class BrowserNetworkStatus extends NetworkStatus {
  override isOnline(): boolean {
    return typeof navigator === 'undefined' || navigator.onLine;
  }
}
