import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from './product.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private productURL = 'http://localhost:3000/api/products';
  private products: Product[] = [];
  private productsUpdated = new Subject<{
    products: Product[];
    productsCount: number;
  }>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getProducts(productPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${productPerPage}&page=${currentPage}`;
    this.httpClient
      .get<{ message: string; products: any; maxProducts: number }>(
        this.productURL + queryParams
      )
      .pipe(
        map((responseData) => {
          return {
            products: responseData.products.map((product) => {
              return {
                id: product._id,
                title: product.title,
                description: product.description,
                imagePath: product.imagePath,
                userId: product.user_id,
              };
            }),
            maxProducts: responseData.maxProducts,
          };
        })
      )
      .subscribe((transformedData) => {
        this.products = transformedData.products;
        this.productsUpdated.next({
          products: [...this.products],
          productsCount: transformedData.maxProducts,
        });
      });
  }

  getProduct(id: string) {
    return this.httpClient.get<{
      _id: string;
      title: string;
      description: string;
      imagePath: string;
      userId: string;
    }>(this.productURL + '/' + id);
  }

  getProductUpdatedListener() {
    return this.productsUpdated.asObservable();
  }

  addProduct(title: string, description: string, image: File) {
    const productData = new FormData();
    productData.append('title', title);
    productData.append('description', description);
    productData.append('image', image, title);
    this.httpClient
      .post<{ message: string; product: Product }>(this.productURL, productData)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  updateProduct(
    id: string,
    title: string,
    description: string,
    image: string | File
  ) {
    let productData: Product | FormData;
    if (typeof image === 'object') {
      productData = new FormData();
      productData.append('id', id);
      productData.append('title', title);
      productData.append('description', description);
      productData.append('image', image, title);
    } else {
      productData = {
        id: id,
        title: title,
        description: description,
        imagePath: image,
        userId: null,
        price: 0,
      };
    }
    this.httpClient
      .put(this.productURL + '/' + id, productData)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  deleteProduct(productId: string) {
    return this.httpClient.delete(this.productURL + '/' + productId);
  }
}
