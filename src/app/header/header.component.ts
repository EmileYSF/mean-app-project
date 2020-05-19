import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription, Observable } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/product.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { ProductsService } from '../products/products.service';
import { Cart } from '../cart/cart.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthentificated = false;
  items: Cart[] = []
  cartSize: number = 0;
  products: Product[] = [];
  searchQuery: FormControl = new FormControl();
  searchedProduct: Observable<Product[]>;
  private productsSubscription: Subscription;
  private cartSizeSubscription: Subscription;
  private authStatusSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private productsService: ProductsService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthentificated) => {
        this.userIsAuthentificated = isAuthentificated;
      });
    this.cartSizeSubscription = this.cartService
      .getItemsSizeListener()
      .subscribe((data) => {
        this.cartSize = data;
      });

    const prod: Product[] = [
      {
        id: 'tete',
        title: 'tata',
        description: 'cososoo',
        category: "car",
        imagePath: 'http://localhost:3000/images/bbbbbb-1587900192426.jpg',
        userId: 'idunno',
        price: 5
      },
      {
        id: 'tete',
        title: 'tata',
        category: "car",
        description: 'cososoo',
        imagePath: 'http://localhost:3000/images/bbbbbb-1587900192426.jpg',
        userId: 'idunno',
        price: 5
      },
      {
        id: 'tetee',
        title: 'tatarata',
        category: "car",
        description: 'cososoo',
        imagePath: 'http://localhost:3000/images/benz-1588074453181.jpg',
        userId: 'idunno',
        price: 5
      },
    ];

    for (const p of prod) {
      this.cartService.addToCart(p);
    }

    this.productsSubscription = this.productsService
      .getProductUpdatedListener()
      .subscribe(
        (productData: { products: Product[]; productsCount: number }) => {
          this.products = productData.products;
        }
      );
    this.searchedProduct = this.searchQuery.valueChanges.pipe(
      startWith(""),
      map(value => this._searchedProduct(value))
    );
  }

  private _searchedProduct(value: string): Product[] {
    const searchValue = value.toLowerCase();

    return this.products.filter(product => product.title.toLowerCase().indexOf(searchValue) === 0);
  }

  onLogout(): void {
    this.authService.logoutUser();
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
    this.productsSubscription.unsubscribe();
    this.cartSizeSubscription.unsubscribe();
  }
}
