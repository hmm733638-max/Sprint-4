import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartViewModel } from './view-models/cart.viewmodel';

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  providers: [CartViewModel],
  templateUrl: './cart.view.html',
  styleUrl: './cart.view.css'
})
export class CartView implements OnInit {
  readonly vm = inject(CartViewModel);

  ngOnInit(): void {
    void this.vm.load();
  }
}
