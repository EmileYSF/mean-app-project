import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/product.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthentificated = false;
  items: Product[] = []
  cartSize: number = 0;
  private cartSizeSubscription: Subscription;
  private authStatusSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthentificated) => {
        this.userIsAuthentificated = isAuthentificated;
      });
    const prod: Product[] = [
      {
        id: 'tete',
        title: 'tata',
        description: 'cososoo',
        imagePath: 'http://localhost:3000/images/bbbbbb-1587900192426.jpg',
        userId: 'idunno',
        price: 5
      },
      {
        id: 'tete',
        title: 'tata',
        description: 'cososoo',
        imagePath: 'http://localhost:3000/images/bbbbbb-1587900192426.jpg',
        userId: 'idunno',
        price: 5
      },
    ];

    for (const p of prod) {
      // this.cartService.addToCart(p);
    }

    this.cartSizeSubscription = this.cartService
      .getItemsSizeListener()
      .subscribe((data) => {
        this.items = [...data.items];
        this.cartSize = data.size;
      });
  }

  onLogout(): void {
    this.authService.logoutUser();
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
    this.cartSizeSubscription.unsubscribe();
  }
}
