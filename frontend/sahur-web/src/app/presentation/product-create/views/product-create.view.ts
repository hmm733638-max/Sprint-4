import { Component } from '@angular/core';
import { ProductCreateViewModel } from '../view-models/product-create.viewmodel';

@Component({
  selector: 'app-product-create-view',
  standalone: true,
  providers: [ProductCreateViewModel],
  templateUrl: './product-create.view.html',
  styleUrl: './product-create.view.css'
})
export class ProductCreateView {
  constructor(readonly vm: ProductCreateViewModel) {}
}
