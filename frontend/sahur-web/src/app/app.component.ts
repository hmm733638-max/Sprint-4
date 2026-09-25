import { Component } from '@angular/core';
import { CatalogView } from './presentation/catalog/views/catalog.view';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CatalogView],
  template: '<app-catalog-view />'
})
export class AppComponent {}
