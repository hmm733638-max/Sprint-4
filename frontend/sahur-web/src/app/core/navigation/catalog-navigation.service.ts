import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CatalogNavigationService {
  private readonly router = inject(Router);

  openProduct(productId: number): Promise<boolean> {
    return this.router.navigate(['/catalogo', productId]);
  }

  backToCatalog(): Promise<boolean> {
    return this.router.navigate(['/catalogo']);
  }
}
