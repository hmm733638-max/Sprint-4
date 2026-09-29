import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionNavigationService {
  private readonly document = inject(DOCUMENT);

  exitToLogin(): void {
    const browser = this.document.defaultView;

    if (!browser) {
      throw new Error('La navegación requiere un navegador.');
    }

    // Reemplaza la entrada actual y descarga el estado de la aplicación.
    browser.location.replace(
      new URL('login', this.document.baseURI).href
    );
  }
}
