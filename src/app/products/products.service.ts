import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from "@angular/common/http";

import { Product } from './product.model';

@Injectable({providedIn: 'root'})
export class ProductsService {
  private baseAdress = "http://localhost:3000";
  private products: Product[] = [];
  private productsUpdated = new Subject<Product[]>();

  constructor(private httpClient: HttpClient) { }

  getProducts() {
    this.httpClient.get<{products: Product[]}>(this.baseAdress + '/products').subscribe((data) => {
      this.products = data.products;
      this.productsUpdated.next([...this.products]);
    });
  }

  getProductUpdatedListener() {
    return this.productsUpdated.asObservable();
  }

  addProduct(title: string, description: string) {
    const product: Product = {
      id: null,
      title: title,
      description: description
    }
    this.httpClient.post<{message: String}>(this.baseAdress + "/products", product).subscribe((data) => {
      console.log(data);
      this.products.push(product);
      this.productsUpdated.next([...this.products]);
    });
  }
}
