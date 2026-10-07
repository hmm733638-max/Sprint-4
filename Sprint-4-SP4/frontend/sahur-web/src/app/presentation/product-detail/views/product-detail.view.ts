import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailViewModel } from '../view-models/product-detail.viewmodel';

@Component({
  selector: 'app-product-detail-view',
  standalone: true,
  imports: [CurrencyPipe],
  providers: [ProductDetailViewModel],
  templateUrl: './product-detail.view.html',
  styleUrl: './product-detail.view.css'
})
export class ProductDetailView implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly vm = inject(ProductDetailViewModel);

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    void this.vm.load(productId);
  }
}
