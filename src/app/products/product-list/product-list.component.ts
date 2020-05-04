import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Product } from '../product.model';
import { ProductsService } from '../products.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { CartService } from 'src/app/cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  isLoading = false;
  totalProducts = 0;
  productsPerPage = 6;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthentificated = false;
  userId: string;
  private productsSubscription: Subscription;
  private authStatusSubscription: Subscription;

  constructor(
    public productsService: ProductsService,
    private authService: AuthService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.productsService.getProducts(this.productsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.productsSubscription = this.productsService
      .getProductUpdatedListener()
      .subscribe(
        (productData: { products: Product[]; productsCount: number }) => {
          this.isLoading = false;
          this.totalProducts = productData.productsCount;
          this.products = productData.products;
        }
      );
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthentificated) => {
        this.userIsAuthentificated = isAuthentificated;
        this.userId = this.authService.getUserId();
      });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.snackBar.open("Product added to your cart", null, {
      duration: 2000,
      panelClass: ['snackBarSuccess']
    })
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.productsService.getProducts(this.productsPerPage, this.currentPage);
  }

  onDelete(productId: string) {
    this.isLoading = true;
    this.productsService.deleteProduct(productId).subscribe(() => {
      this.productsService.getProducts(this.productsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }
}
