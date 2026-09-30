import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { CatalogViewModel } from '../view-models/catalog.viewmodel';

@Component({
  selector: 'app-catalog-view',
  standalone: true,
  imports: [CurrencyPipe],
  providers: [CatalogViewModel],
  templateUrl: './catalog.view.html',
  styleUrl: './catalog.view.css'
})
export class CatalogView implements OnInit {
  readonly vm = inject(CatalogViewModel);

  ngOnInit(): void {
    void this.vm.initialize();
  }
}
