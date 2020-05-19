import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from './cart.service';
import { Product } from '../products/product.model';
import { Cart } from './cart.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  cart: { items: Cart[], totalPrice: number } = { items: [], totalPrice: 0 };
  totalPrice: number = 0;
  private cartItemsSubscription: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // this.isLoading = true;
    this.cart.items = this.cartService.getItems();
    this.updatePrice()
    this.cartItemsSubscription = this.cartService.getCartItemsListener().subscribe(items => {
      // this.isLoading = false;
      this.cart.items = items;
    });
  }

  addItem(id: string) {
    this.cartService.addItemQuantity(id);
    this.updatePrice()
  }

  removeItem(id: string) {
    this.cartService.removeItemQuantity(id);
    this.updatePrice()
  }

  deleteItem(id: string) {
    this.cartService.removeItem(id);  
    this.updatePrice()
  }

  updatePrice() {
    this.cart.totalPrice = 0;
    for (let item of this.cart.items) {
      this.cart.totalPrice += item.count * item.product.price;
    }
  }

  ngOnDestroy(): void {
    this.cartItemsSubscription.unsubscribe();
  }
}
