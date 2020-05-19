import { Injectable } from '@angular/core';
import { Product } from '../products/product.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { Cart } from './cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  items: Cart[] = [];
  private cartItemsListener = new Subject<Cart[]>();
  private cartSizeListener = new Subject<number>();

  constructor() {}

  getItems() {
    return [...this.items];
  }

  addToCart(product) {
    const index = this.items.findIndex(item => item.product.id == product.id);
    var item: Cart;
    if (index > -1) {
      this.items[index].count++;
    } else {
      const item: Cart = {product: product, count: 1};
      this.items.push(item);
    }
    this.cartSizeListener.next(this.items.length);
  }

  addItemQuantity(id: string) {
    const index = this.items.findIndex(item => item.product.id == id);
    if (index > -1) {
      this.items[index].count++;
    }
  }

  removeItemQuantity(id: string) {
    const index = this.items.findIndex(item => item.product.id == id);
    if (index > -1) {
      if (this.items[index].count > 1)  {
        this.items[index].count--;
      } else {
        this.items.splice(index, 1);
        this.cartItemsListener.next(this.items);
        this.cartSizeListener.next(this.items.length);
      }
    }
  }

  removeItem(id: string) {
    const index = this.items.findIndex(item => item.product.id == id);
    if (index > -1) {
      this.items.splice(index, 1);
    }
    this.cartItemsListener.next(this.items);
    this.cartSizeListener.next(this.items.length);
  }

  clearCart() {
    this.items = [];
    return this.items;
  }

  getCartItemsListener() {
    return this.cartItemsListener.asObservable();
  }

  getItemsSizeListener() {
    return this.cartSizeListener.asObservable();
  }
}
