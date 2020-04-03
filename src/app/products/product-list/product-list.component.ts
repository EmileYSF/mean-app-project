import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Product } from '../product.model';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  private productsSubscription : Subscription;

  constructor(public productsService: ProductsService) { }

  ngOnInit(): void {
    this.productsService.getProducts();
    this.productsSubscription = this.productsService.getProductUpdatedListener().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }
}
