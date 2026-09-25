import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CatalogViewModel } from '../view-models/catalog.viewmodel';

@Component({
  selector: 'app-catalog-view',
  standalone: true,
  imports: [CurrencyPipe],
  providers: [CatalogViewModel],
  template: `
    <main class="container">
      <h1>SAHUR</h1>
      <p>Solución base Angular + .NET · MVVM · SOLID · CQRS</p>
      @if (vm.loading()) { <p>Cargando productos...</p> }
      @if (vm.error()) { <p>{{ vm.error() }}</p> }
      <section class="grid">
        @for (product of vm.products(); track product.id) {
          <article class="card">
            <img [src]="product.image" [alt]="product.title">
            <h2>{{ product.title }}</h2>
            <strong>{{ product.price | currency }}</strong>
          </article>
        }
      </section>
    </main>
  `
})
export class CatalogView implements OnInit {
  constructor(readonly vm: CatalogViewModel) {}
  ngOnInit(): void { void this.vm.load(); }
}
