import { Injectable } from '@angular/core';
import { Product } from '../products/product.model';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  items: Product[] = [];
  private cartSizeListener = new BehaviorSubject<{
    items: Product[];
    size: number;
  }>({items: [], size: 0});

  constructor() {}

  getItems() {
    return [...this.items];
  }

  addToCart(product) {
    this.items.push(product);
    this.cartSizeListener.next({ items: this.items, size: this.items.length });
  }

  clearCart() {
    this.items = [];
    return this.items;
  }

  getItemsSizeListener() {
    return this.cartSizeListener.asObservable();
  }
}
